openai-structured-output-sample
==========

This is a sample application to demonstrate how to use [Structured Outputs](https://openai.com/index/introducing-structured-outputs-in-the-api/) in **OpenAI Chat Completions API** _with streaming_, built using [Next.js](https://nextjs.org/docs).


# Motivation

There are two ways to use structured output in the API. 

First one is by setting the output format based on tool schema. This is useful when we want the API to complete or supply the values for the fields in the tool.

Second one is by setting the output format based on a new parameter called `response_format`, by supplying a JSON schema for how we want the output will be irregardless of the output format of the tools invoked. Previously, this is difficult to achieve if you are using tools. Now, with the new parameter, it becomes very easy. This one is what we will be doing.


# Setting up Streaming

**Vercel**, the maker of Next.js, has [AI SDK](https://sdk.vercel.ai/docs/introduction), a helper toolkit for AI-powered applications in Next.js, etc. but we will not be using it. We will just use [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) for simplicity.


## Client-side

To setup streaming in the client-side

```javascript
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

let is_completed = false

while(!is_completed) {

  const { done, value } = await reader.read()

  if(done) {
      is_completed = true
      break
  }

  const raw_delta = new TextDecoder().decode(value)

  // console.log(raw_delta)

}
```


## Server-side

To setup streaming in server-side using route handler

[/app/api/stream/route.js](/src/app/api/stream/route.js)
```javascript
export async function POST(request) {

return new Response(new ReadableStream({
    async pull(controller) {

      // controller.enqueue(text) // sends text to client

      controller.close() // close stream

    }
  }), {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream'
    }
  })

}
```


# Setup

Clone the repository and install the dependencies

```sh
git clone https://github.com/supershaneski/openai-structured-output-sample.git myproject

cd myproject

npm install
```

Copy `.env.example` and rename it to `.env` then edit the `OPENAI_API_KEY` with your OpenAI API key.

```sh
OPENAI_API_KEY=PUT-YOUR-OPENAI-APIKEY-HERE
```

Then to run the app

```sh
npm run dev
```

Open your browser to `http://localhost:3000/` to load the application page.