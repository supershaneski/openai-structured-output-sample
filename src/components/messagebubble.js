'use client'

import React from 'react'
import Markdown from 'react-markdown'
import classes from './messagebubble.module.css'
import { markdownImageChecker } from '@/lib/utils'

const MessageBubble = React.forwardRef(function MessageBubble({
    text = '',
    images = []
}, ref) {
    return (
        <div className={classes.container}>
            <div ref={ref} className={classes.messagepanel}>
                <Markdown>{text}</Markdown>
            </div>
            {
                (images.length > 0 && !markdownImageChecker(text)) &&
                <div className={classes.imagepanel}>
                {
                    images.map((a, i) => (
                        <img key={i} className={classes.image} src={a.url} alt={a.alt} />
                    ))
                }
                </div>
            }
        </div>
    )
})

export default MessageBubble