import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, stage, messages } = await request.json()
    
    // Create or update conversation
    let conversation = await db.conversation.findUnique({
      where: { sessionId }
    })
    
    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          sessionId,
          stage
        }
      })
    } else {
      conversation = await db.conversation.update({
        where: { sessionId },
        data: { stage }
      })
    }
    
    // Add messages if provided
    if (messages && Array.isArray(messages)) {
      for (const message of messages) {
        await db.message.create({
          data: {
            conversationId: conversation.id,
            speaker: message.speaker,
            text: message.text,
            expression: message.expression
          }
        })
      }
    }
    
    return NextResponse.json({ success: true, conversation })
  } catch (error) {
    console.error('Error saving conversation:', error)
    return NextResponse.json({ error: 'Failed to save conversation' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }
    
    const conversation = await db.conversation.findUnique({
      where: { sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    
    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 })
  }
}