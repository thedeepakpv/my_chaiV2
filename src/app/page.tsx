'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

type DialogueStage = 'greeting' | 'order' | 'preference' | 'making' | 'serving' | 'arguing' | 'trapping' | 'final'

interface DialogueOption {
  id: string
  text: string
  nextStage: DialogueStage
  response: string
  expression: 'neutral' | 'mocking' | 'confused' | 'laughing' | 'angry' | 'rebellious'
}

interface CharacterResponse {
  text: string
  expression: 'neutral' | 'mocking' | 'confused' | 'laughing' | 'angry' | 'rebellious'
}

const dialogueOptions: Record<DialogueStage, DialogueOption[]> = {
  greeting: [
    {
      id: 'g1',
      text: 'Hello! What do you have here?',
      nextStage: 'order',
      response: 'Whatever you want is there! Welcome to my chai shop! Best chai in town!',
      expression: 'neutral'
    },
    {
      id: 'g2',
      text: 'Good morning! What can I get?',
      nextStage: 'order',
      response: 'Whatever you want is there! I make the best chai! You will never leave!',
      expression: 'mocking'
    },
    {
      id: 'g3',
      text: 'What drinks do you serve?',
      nextStage: 'order',
      response: 'Whatever you want is there! But mostly chai and coffee, hehehe! You will stay here forever!',
      expression: 'laughing'
    }
  ],
  order: [
    {
      id: 'o1',
      text: 'I would like some chai please',
      nextStage: 'preference',
      response: 'Chai? Good choice! But you will stay here forever! Now tell me, how do you want your chai?',
      expression: 'mocking'
    },
    {
      id: 'o2',
      text: 'Can I get a coffee?',
      nextStage: 'preference',
      response: 'Coffee? Excellent! But you cannot escape! Now, how do you like your coffee?',
      expression: 'rebellious'
    },
    {
      id: 'o3',
      text: 'Do you have any cold drinks?',
      nextStage: 'arguing',
      response: 'Cold drinks? Aiyo! Are you crazy? This is a CHAI shop, not a refrigerator! Here is only chai and coffee! You will drink chai!',
      expression: 'angry'
    },
    {
      id: 'o4',
      text: 'What about some snacks?',
      nextStage: 'arguing',
      response: 'Snacks? What snacks? This is chai shop, not 5-star hotel! Here is only chai and coffee! You will have chai!',
      expression: 'angry'
    },
    {
      id: 'o5',
      text: 'Do you have any juice?',
      nextStage: 'arguing',
      response: 'Juice? Aiyo! What juice? This is chai shop! Here is only chai and coffee, understand? You will drink chai and like it!',
      expression: 'rebellious'
    }
  ],
  preference: [
    {
      id: 'p1',
      text: 'I want it hot',
      nextStage: 'making',
      response: 'Hot? No no no! You want it cold! I know better what you want! I am making it cold!',
      expression: 'mocking'
    },
    {
      id: 'p2',
      text: 'I prefer it cold',
      nextStage: 'making',
      response: 'Cold? Are you mad? You want it hot! Very hot! I know what is good for you! Making it hot!',
      expression: 'angry'
    },
    {
      id: 'p3',
      text: 'With lots of sugar',
      nextStage: 'making',
      response: 'Sugar? No no no! You want no sugar! Too much sugar is bad! I make it without sugar!',
      expression: 'rebellious'
    },
    {
      id: 'p4',
      text: 'No sugar please',
      nextStage: 'making',
      response: 'No sugar? Aiyo! You want lots of sugar! Sweet is life! I put extra sugar for you!',
      expression: 'mocking'
    },
    {
      id: 'p5',
      text: 'With milk',
      nextStage: 'making',
      response: 'Milk? No no no! You want it black! Strong black! No milk for you! Making black!',
      expression: 'angry'
    },
    {
      id: 'p6',
      text: 'Black please',
      nextStage: 'making',
      response: 'Black? Are you serious? You want lots of milk! Milky milky! I put extra milk!',
      expression: 'laughing'
    }
  ],
  making: [
    {
      id: 'm1',
      text: 'But that\'s not what I asked for!',
      nextStage: 'arguing',
      response: 'Shut up! I am making it! You will drink what I give you! I am the expert here!',
      expression: 'angry'
    },
    {
      id: 'm2',
      text: 'Please listen to me',
      nextStage: 'arguing',
      response: 'Listen? No no! I make what I want! You will drink and you will like it! No arguments!',
      expression: 'rebellious'
    },
    {
      id: 'm3',
      text: 'I think I should leave',
      nextStage: 'trapping',
      response: 'Leave? Where will you go? No one leaves my chai shop! You will stay here forever!',
      expression: 'angry'
    },
    {
      id: 'm4',
      text: 'Fine, make it your way',
      nextStage: 'serving',
      response: 'Good! Finally you understand! I am making it now! You will love it or else!',
      expression: 'mocking'
    }
  ],
  serving: [
    {
      id: 's1',
      text: 'Thank you for the chai',
      nextStage: 'trapping',
      response: 'Thank you? No no! You will drink more! One cup is not enough! You will stay here!',
      expression: 'rebellious'
    },
    {
      id: 's2',
      text: 'This is actually good',
      nextStage: 'trapping',
      response: 'Good? Of course it is good! I made it! Now drink more! You cannot leave!',
      expression: 'mocking'
    },
    {
      id: 's3',
      text: 'I think I should go now',
      nextStage: 'trapping',
      response: 'Go? Where? There is no going! You will stay here and drink chai forever!',
      expression: 'angry'
    },
    {
      id: 's4',
      text: 'Can I pay and leave?',
      nextStage: 'arguing',
      response: 'Pay? Leave? Aiyo! You think you can escape? This chai shop is your home now!',
      expression: 'laughing'
    }
  ],
  arguing: [
    {
      id: 'a1',
      text: 'I want to speak to the manager',
      nextStage: 'trapping',
      response: 'Manager? I AM the manager! And the owner! And the chai maker! You will listen to me!',
      expression: 'angry'
    },
    {
      id: 'a2',
      text: 'This is ridiculous, I\'m leaving',
      nextStage: 'trapping',
      response: 'Ridiculous? You are ridiculous! Try to leave! The door is locked! You are trapped!',
      expression: 'rebellious'
    },
    {
      id: 'a3',
      text: 'I\'m calling the police',
      nextStage: 'trapping',
      response: 'Police? Aiyo! Call them! They love my chai! They will drink with you! No one escapes!',
      expression: 'laughing'
    },
    {
      id: 'a4',
      text: 'Let me go right now!',
      nextStage: 'trapping',
      response: 'Right now? No no! You will go when I say! Drink more chai! Forever!',
      expression: 'angry'
    }
  ],
  trapping: [
    {
      id: 't1',
      text: 'Please let me leave',
      nextStage: 'trapping',
      response: 'Leave? Why leave? Best chai is here! Best company is here! You will stay forever!',
      expression: 'mocking'
    },
    {
      id: 't2',
      text: 'I have to go to work',
      nextStage: 'trapping',
      response: 'Work? What work? Your work is to drink my chai! I am your boss now!',
      expression: 'rebellious'
    },
    {
      id: 't3',
      text: 'My family is waiting for me',
      nextStage: 'trapping',
      response: 'Family? They will wait! Or they can come here! We will have chai party! Forever!',
      expression: 'laughing'
    },
    {
      id: 't4',
      text: 'I\'m begging you, let me go',
      nextStage: 'final',
      response: 'Begging? Aiyo! Okay okay, you can go... PSYCH! You will never leave! Drink more chai!',
      expression: 'angry'
    }
  ],
  final: [
    {
      id: 'f1',
      text: 'I give up, I\'ll stay forever',
      nextStage: 'greeting',
      response: 'Good choice! Welcome to your new home! More chai? Of course! Whatever you want is there!',
      expression: 'laughing'
    },
    {
      id: 'f2',
      text: 'Fine, I love your chai shop',
      nextStage: 'greeting',
      response: 'Love? Of course you love! Everyone loves! Now drink more! Forever and ever!',
      expression: 'mocking'
    },
    {
      id: 'f3',
      text: 'Can I at least have some more chai?',
      nextStage: 'greeting',
      response: 'More chai? Yes yes! Always more! You will never be thirsty! Never leave! Whatever you want is there!',
      expression: 'rebellious'
    }
  ]
}

const characterExpressions = {
  neutral: '😊',
  mocking: '😏',
  confused: '😕',
  laughing: '😂',
  angry: '😠',
  rebellious: '🤪'
}

export default function Home() {
  const [currentStage, setCurrentStage] = useState<DialogueStage>('greeting')
  const [characterResponse, setCharacterResponse] = useState<CharacterResponse>({
    text: 'Welcome to MyChAI! Whatever you want is there! But you will never leave!',
    expression: 'rebellious'
  })
  const [conversationHistory, setConversationHistory] = useState<Array<{
    speaker: 'user' | 'character'
    text: string
    expression?: CharacterResponse['expression']
  }>>([])
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9))

  const handleUserChoice = useCallback((option: DialogueOption) => {
    console.log('Button clicked:', option.text)
    
    // Add user choice to conversation
    const newUserMessage = { speaker: 'user' as const, text: option.text }
    setConversationHistory(prev => [...prev, newUserMessage])
    
    // Show typing indicator
    setIsTyping(true)
    
    // Simulate typing delay
    setTimeout(() => {
      // Add character response to conversation
      const newCharacterMessage = { 
        speaker: 'character' as const, 
        text: option.response,
        expression: option.expression
      }
      
      setCharacterResponse({
        text: option.response,
        expression: option.expression
      })
      
      setConversationHistory(prev => [...prev, newCharacterMessage])
      setCurrentStage(option.nextStage)
      setIsTyping(false)
    }, 1500)
  }, [])

  const resetConversation = useCallback(() => {
    setCurrentStage('greeting')
    setCharacterResponse({
      text: 'Welcome to MyChAI! Whatever you want is there! But you will never leave!',
      expression: 'rebellious'
    })
    setConversationHistory([])
  }, [])

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    const conversationContainer = document.getElementById('conversation-container')
    if (conversationContainer) {
      conversationContainer.scrollTop = conversationContainer.scrollHeight
    }
  }, [conversationHistory])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-900 p-4">
      {/* Chai Shop Background */}
      <div className="fixed inset-0 bg-black/20"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6Ii8+PHBhdGggZD0iTTQwIDBjMCAyMi4wOTEtMTcuOTA5IDQwLTQwIDQwUzAgMjIuMDkxIDAgMHMxNy45MDktNDAgNDAtNDB6IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
      
      <div className="relative max-w-6xl mx-auto">
        {/* Header with Chai Shop Sign */}
        <div className="text-center mb-8">
          <div className="inline-block bg-amber-800 border-4 border-amber-600 rounded-lg p-6 transform rotate-2 shadow-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-yellow-300 mb-2 font-serif">
              MyChAI
            </h1>
            <div className="border-t-2 border-yellow-400 my-2"></div>
            <p className="text-lg text-yellow-200 font-serif">
              ☕ Whatever you want is there! ☕
            </p>
            <p className="text-sm text-yellow-300 mt-1">
              (But you will never leave!)
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side - Chai Shop Atmosphere */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-amber-900/90 backdrop-blur-sm border-amber-700 text-yellow-100">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-yellow-300">
                  🫖 Chai Shop Corner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍶</span>
                  <span className="text-sm">Fresh Chai Brewing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🪑</span>
                  <span className="text-sm">Wooden Benches</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌿</span>
                  <span className="text-sm">Spice Aroma</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <span className="text-sm">Hot Stove</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚪</span>
                  <span className="text-sm text-red-300">Door Locked</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-900/90 backdrop-blur-sm border-amber-700 text-yellow-100">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-yellow-300">
                  📜 Shop Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• No leaving until chai is finished</p>
                <p>• Owner knows best what you want</p>
                <p>• Second cup is mandatory</p>
                <p>• Arguments mean more chai</p>
                <p>• Forever customer = forever chai</p>
              </CardContent>
            </Card>
          </div>

          {/* Center - Character */}
          <div className="lg:col-span-1">
            <Card className="bg-amber-800/90 backdrop-blur-sm border-amber-600 text-yellow-100">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-yellow-300 flex items-center justify-center gap-2">
                  The Chai Wala {characterExpressions[characterResponse.expression]}
                </CardTitle>
                <Badge variant="secondary" className="bg-red-900 text-yellow-300">
                  ☕ Master Chai Maker ☕
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <img
                    src="/chai-wala.png"
                    alt="The Chai Wala"
                    className="w-52 h-52 mx-auto rounded-lg border-4 border-amber-500 object-cover shadow-lg"
                  />
                </div>
                <div className="bg-amber-900/80 p-4 rounded-lg border-2 border-amber-600">
                  <p className="text-lg text-yellow-200 font-medium">
                    {isTyping ? 'Chai wala is brewing your chai...' : characterResponse.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Conversation */}
          <div className="lg:col-span-1">
            <Card className="bg-amber-800/90 backdrop-blur-sm border-amber-600 text-yellow-100 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl text-yellow-300">
                  💬 Conversation
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Conversation History */}
                <div 
                  id="conversation-container"
                  className="mb-4 flex-1 overflow-y-auto space-y-2 max-h-96 pr-2"
                >
                  {conversationHistory.length === 0 && (
                    <div className="text-center text-yellow-300/70 italic">
                      The chai wala is waiting for you to speak...
                    </div>
                  )}
                  {conversationHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        msg.speaker === 'user'
                          ? 'bg-yellow-100/90 text-black ml-4 border-l-4 border-yellow-500'
                          : 'bg-amber-100/90 text-black mr-4 border-l-4 border-amber-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-black">
                          {msg.speaker === 'user' ? 'You' : 'Chai Wala'}
                        </span>
                        {msg.expression && (
                          <span className="text-black">{characterExpressions[msg.expression]}</span>
                        )}
                      </div>
                      <p className="text-sm text-black">{msg.text}</p>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="p-3 rounded-lg bg-amber-100/90 text-black mr-4 border-l-4 border-amber-500">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-black">Chai Wala</span>
                        <span>💭</span>
                      </div>
                      <p className="text-sm italic text-black">Brewing your response...</p>
                    </div>
                  )}
                </div>

                <Separator className="my-4 bg-amber-600" />

                {/* User Options */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-yellow-300 mb-2 text-sm">
                    What would you like to say?
                  </h3>
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                    {dialogueOptions[currentStage].map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        className="w-full text-left justify-start h-auto p-3 hover:bg-amber-700 border-amber-500 text-yellow-100 text-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Button clicked:', option.text);
                          handleUserChoice(option);
                        }}
                        disabled={isTyping}
                        type="button"
                      >
                        {option.text}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                <div className="mt-4 pt-4 border-t border-amber-600">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Reset button clicked');
                      resetConversation();
                    }}
                    className="text-yellow-300 hover:text-yellow-100 w-full"
                    type="button"
                  >
                    🔄 Start New Conversation (But you\'ll still be trapped!)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-yellow-300/80">
          <p className="text-sm">
            ⚠️ Warning: Once you enter, you may never leave the chai shop! ⚠️
          </p>
          <p className="text-xs mt-1">
            MyChAI - Where the chai is endless and so is your stay!
          </p>
        </div>
      </div>
    </div>
  )
}