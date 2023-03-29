import { useEffect, useState } from 'react'

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function SearchResult(props) {

  const { isSearching, chat, isDarkMode } = props

  const [blocks, setBlocks] = useState([])

  useEffect(() => {
    if (chat.length > 1) {
      const response = chat[chat.length-1].content
      const blocks = response.split('```')
      setBlocks(blocks)
    }
  }, [chat])

  return (
    <>
      <li className='main-card'>
        {
          !isSearching && chat.length > 1 ? (
            <>
              <span className='question-text'>{chat[chat.length-2].content}</span>
              <p className='reply-text'>
                {/* {chat[chat.length-1].content} */}
                {
                  blocks.map((text, index) => {
                    if (index % 2 !== 0 && text !== '') {
                      console.log(text)
                      return (
                        <SyntaxHighlighter
                          wrapLongLines
                          style={isDarkMode ? vscDarkPlus : vs}>
                          {text.trim()}
                        </SyntaxHighlighter>
                      )
                    } else if (text !== '') {
                      const codeBlocks = text.trim().split('`')

                      return (
                        <p>
                          {
                            codeBlocks.map((block, i) => {
                              if (i % 2 !== 0 && block !== '') {
                                return <code>{block}</code>
                              } else {
                                return <span>{block}</span>
                              }
                            })
                          }
                        </p>
                      )
                    }
                  })
                }
              </p>
            </>
          ) : (
            <div className='loading-holder'>
              <div className='brick shimmer thick' />
              <br />
              <div className='brick shimmer' style={{width: '100%'}} />
              <div className='brick shimmer' style={{width: '80%'}} />
              <div className='brick shimmer' style={{width: '90%'}} />
              <br />
              <div className='brick shimmer' style={{width: '75%'}} />
              <div className='brick shimmer' style={{width: '95%'}} />
              <br />
              <div className='brick shimmer' style={{width: '60%'}} />
              <div className='brick shimmer' style={{width: '45%'}} />
            </div>
          )
        }
      </li>
    </>
  )

}