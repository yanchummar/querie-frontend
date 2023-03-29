import { CHARACTERS, DEFAULT_SYSTEM_PROMPT } from '@/constants'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Check, Loader } from 'react-feather'

export default function EnhancePopup(props) {

  const { isOpen, closePopup, promptInput, setPromptInput } = props

  const [activeCharacter, setActiveCharacter] = useState(undefined)

  const onPromptInput = (e) => {
    setActiveCharacter(undefined)
    setPromptInput(e.target.value)
  }

  const selectCharacter = (character) => {
    if (character.name === activeCharacter) {
      setActiveCharacter(undefined)
    } else {
      setPromptInput(character.prompt)
      setActiveCharacter(character.name)
    }
  }

  const resetToDefault = () => {
    setActiveCharacter(undefined)
    setPromptInput(DEFAULT_SYSTEM_PROMPT)
  }

  return (
    <>
      <div className={`enhance-popup-container ${isOpen ? '' : 'hidden'}`}>
        <div 
          className='blur-bg'
          onClick={closePopup} />

        <div className='popup-card'>
          <div className='header'>
            <span className='title-text'>
              <Loader className='loader-icon' strokeWidth={3} />
              <span>Enhance</span>
            </span>
            <Check
              strokeWidth={3}
              className='close-icon'
              onClick={closePopup} />
          </div>
          <div className='card-content'>
            <div className='prompt-section'>
              <div className='text-holder'>
                <span className='title-text'>
                  <span>Who do you want to ask to?</span>
                  <button 
                    className='reset-btn'
                    onClick={resetToDefault}>
                    Reset to Default
                  </button>
                </span>
                <span className='subtitle-text'>You can elaborate on who/what will be responding to your questions.</span>
              </div>
              <textarea 
                className='prompt-input'
                disabled={activeCharacter !== undefined}
                value={promptInput}
                onInput={onPromptInput}
                placeholder="You're Albert Einstein, and will answer only questions about relativity." />    
            </div>

            <div className='or-divider'>
                <div className='line' />
                <span className='or-text'>or</span>
                <div className='line' />
              </div>

            <div className='character-section'>
              <div className='text-holder bottom'>
                <span className='title-text'>
                  <span>Ask a specialist</span>
                </span>
                <span className='subtitle-text'>Choose a character/personality to answer your questions.</span>
              </div>
              <ul className='characters-list'>
                {
                  CHARACTERS.map(character => (
                    <li 
                      className={character.name === activeCharacter ? 'active' : ''}
                      onClick={() => selectCharacter(character)} >{character.name}</li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}