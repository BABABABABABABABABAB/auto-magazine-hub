import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured')
    }

    console.log('Starting article generation process...')
    const { url } = await req.json()
    if (!url) {
      throw new Error('URL is required')
    }

    console.log('Fetching content from URL:', url)
    const response = await fetch(url)
    const htmlContent = await response.text()

    const textContent = htmlContent.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000)

    console.log('Extracted text content length:', textContent.length)
    console.log('Making request to OpenAI API...')

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un rédacteur expert qui génère des articles en français. Génère un article bien structuré basé sur le contenu fourni.'
          },
          {
            role: 'user',
            content: `Génère un article basé sur ce contenu: ${textContent}\n\nFormat souhaité:\n{
              "title": "Titre de l'article",
              "content": "Contenu de l'article en HTML avec des balises <p>, <h2>, etc.",
              "excerpt": "Bref résumé de l'article",
              "meta_title": "Titre SEO",
              "meta_description": "Description SEO"
            }`
          }
        ],
      }),
    })

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await openAIResponse.json()
    console.log('OpenAI response received')

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI')
    }

    const generatedContent = JSON.parse(data.choices[0].message.content)

    return new Response(JSON.stringify(generatedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in generate-article function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})