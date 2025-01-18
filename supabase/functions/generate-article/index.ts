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
    const { url } = await req.json()

    // Fetch content from URL
    const response = await fetch(url)
    const htmlContent = await response.text()

    // Extract text content (basic implementation)
    const textContent = htmlContent.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000) // Limit content length

    // Generate article using OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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

    const data = await openAIResponse.json()
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