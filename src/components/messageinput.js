'use client'

import React from 'react'
import classes from './messageinput.module.css'

const MessageInput = React.forwardRef(function MessageInput({ 
    message,
    setMessage,
    onSubmit,
    placeholder
}, ref) {

    const handleSubmit = (e) => {
        if(e.keyCode === 13) {
            e.preventDefault()
            if(message && onSubmit) {
                onSubmit()
            }
        }
    }

    return (
        <div className={classes.container}>
            <input
            ref={ref}
            type='text'
            className={classes.input}
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleSubmit}
            />
        </div>
    )
})

export default MessageInput