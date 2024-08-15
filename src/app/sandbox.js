'use client'

import React from 'react'
import { createPortal } from 'react-dom'

import MessageInput from '@/components/messageinput'
import MessageBubble from '@/components/messagebubble'
import Loader from '@/components/loader'
import { SimpleId, formatJSON } from '@/lib/utils'

import classes from './sandbox.module.css'

export default function Sandbox() {

    const inputRef = React.useRef()
    const outputRef = React.useRef()
    const timerRef = React.useRef()
    
    const [messages, setMessages] = React.useState([])
    const [texts, setTexts] = React.useState('')
    const [images, setImages] = React.useState([])
    const [messageInput, setMessageInput] = React.useState('')
    const [messageOutput, setMessageOutput] = React.useState('')
    const [isLoading, setLoading] = React.useState(false)

    React.useEffect(() => {
        
        if(messageOutput) {

            try {
                
                const rawJSON = formatJSON(messageOutput)

                const obj = JSON.parse(rawJSON)
                
                if(obj) {

                    console.log(obj)

                    if(obj.message) {
                        setTexts(obj.message)
                    }
                    if(obj.images?.length > 0) {
                        setImages(obj.images)
                    }
                }

            } catch(e) {
                console.log(e.message)
            }
            
        }

    }, [messageOutput])

    React.useEffect(() => {
        if(texts) {
            setLoading(false)
        }
    }, [texts])

    const handleSubmit = React.useCallback(async () => {

        console.log('submit', (new Date()).toLocaleTimeString())

        setLoading(true)

        const context = messages.map((a) => ({ role:a.role, content:a.content }))
        
        const user_message = {
            id: SimpleId(),
            created_at: Date.now(),
            role: 'user',
            content: messageInput
        }

        setMessages((prev) => [...prev, user_message])

        setMessageInput('')

        inputRef.current.blur()

        try {

            const response = await fetch('/api/stream/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    context: context,
                    message: user_message.content
                })
            })

            const reader = response.body.getReader()

            const assistant_id = SimpleId()

            setMessageOutput('')

            resetScroll()

            const assistant_message = {
                id: assistant_id,
                created_at: Date.now(),
                role: 'assistant',
                content: ''
            }

            setMessages((prev) => [...prev, assistant_message])

            let is_completed = false

            while(!is_completed) {

                const { done, value } = await reader.read()
        
                if(done) {
                    is_completed = true
                    break
                }

                const raw_delta = new TextDecoder().decode(value)

                setMessageOutput((a) => a + raw_delta)

                setMessages((prev) => 
                    prev.map((a) => a.id !== assistant_id ? a : {...a, content: a.content + raw_delta})
                )

                resetScroll()

            }

            console.log('end stream', (new Date()).toLocaleTimeString())

        } catch(e) {    
            console.log(e.message)
        } finally {
            
            resetScroll()
            inputRef.current.focus()

        }

    }, [messages, messageInput])

    const resetScroll = () => {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            outputRef.current.scrollTop = outputRef.current.scrollHeight
        }, 200)
    }

    return (
        <div className={classes.container}>
            <MessageBubble 
            ref={outputRef}
            text={texts}
            images={images}
            />
            <MessageInput 
            ref={inputRef}
            placeholder={messages.length > 0 ? 'Type your message' : 'How can I help you?'}
            message={messageInput} 
            setMessage={setMessageInput} 
            onSubmit={handleSubmit}
            />
            {
                isLoading && createPortal(
                    <Loader />,
                    document.body,
                )
            }
        </div>
    )
}