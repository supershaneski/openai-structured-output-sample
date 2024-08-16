import openai from '@/service/openai'
import response_format from '@/assets/response_format.json'
import get_weather from '@/assets/get_weather.json'
import get_events from '@/assets/get_events.json'
import { mockApiCall } from '@/lib/mockapi'

export async function POST(request) {
    
    let { message, context } = await request.json()

    console.log('message', message)

    let system_prompt = `You are a helpful assistant.\n` +
        `Today is ${new Date()}.`

    let messages = [
        { role: "system", content: system_prompt }
    ]

    if(context.length > 0) {
        messages = [...messages, ...context]
    }

    messages.push({ role: "user", content: message })

    let tools = [get_weather, get_events]
    
    return new Response(new ReadableStream({
        async pull(controller) {

            let is_completed = false
            let tool_calls = []
            let tool_content = ''
            
            console.log('stream start', (new Date()).toLocaleTimeString())

            do {

                let message_items = messages

                // Process the tools invoked
                if (Object.keys(tool_calls).length > 0) {

                    let tool_message = { role: 'assistant', content: tool_content || null, tool_calls: [] }
                    let tool_outputs = []

                    for(let i = 0; i < tool_calls.length; i++) {

                        let tool_id = tool_calls[i].id
                        
                        try {
    
                            tool_message.tool_calls.push({
                                id: tool_id,
                                type: 'function',
                                function: tool_calls[i].function
                            })
    
                            const tool_name = tool_calls[i].function.name
                            const tool_args = JSON.parse(tool_calls[i].function.arguments)

                            let tool_output = { status: 'error', name: tool_name, message: 'tool not found' }
    
                            try {

                                const response = await mockApiCall(tool_name, tool_args)
                                
                                tool_output = { ...tool_args, ...response.data }
                                
                            } catch(e) {
                                console.log(e.message)
                            }

                            tool_outputs.push({
                                tool_call_id: tool_id,
                                role: 'tool',
                                name: tool_name,
                                content: JSON.stringify(tool_output)
                            })
    
                        } catch(e) {
                            console.log('error-tool', e.message)
                        }
    
                    }

                    message_items.push(tool_message)

                    tool_outputs.forEach((tool_output) => {
                        message_items.push(tool_output)
                    })

                    console.log(tool_message)
                    console.log(tool_outputs)
                    
                }

                tool_calls = []
                tool_content = ''
                
                try {

                    const stream = await openai.chat.completions.create({
                        model: "gpt-4o-mini-2024-07-18",
                        messages: message_items,
                        tools: tools,
                        response_format: response_format,
                        stream: true,
                        temperature: 0.9,//0.2
                    })

                    for await (const chunk of stream) {
                        if(chunk.choices.length > 0) {
        
                            if(chunk.choices[0].delta.content) {

                                tool_content += chunk.choices[0].delta.content
                                controller.enqueue(chunk.choices[0].delta.content)

                            }
        
                            if(chunk.choices[0].delta.tool_calls) {
        
                                chunk.choices[0].delta.tool_calls.forEach((tool) => {
                                    if(tool_calls[tool.index]) {
                                        tool_calls[tool.index].function.arguments += tool.function.arguments
                                    } else {
                                        tool_calls[tool.index] = {
                                            id: tool.id,
                                            function: tool.function
                                        }
                                    }
                                })
        
                            }
        
                            if(chunk.choices[0].finish_reason) {
                                console.log('finished_reason', chunk.choices[0].finish_reason)
                            }
        
                        }
                    }
                    
                    // Exit loop if no tools invoked.
                    if(tool_calls.length === 0) {
                        is_completed = true
                    }

                } catch(e) {
                    
                    console.log(e.message)

                    is_completed = true

                }

            } while(!is_completed)

            console.log('stream close', (new Date()).toLocaleTimeString())

            controller.close()
        }
    }), {
        status: 200,
        headers: {
            'Content-Type': 'text/event-stream'
        }
    })

}