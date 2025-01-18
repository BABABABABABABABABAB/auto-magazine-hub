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

    console.log('Starting SEO generation process...')
    const { content, title } = await req.json()
    if (!content) {
      throw new Error('Content is required')
    }

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
            content: `Tu es un expert en SEO qui génère des métadonnées optimisées pour le référencement. 
            Pour un article donné, tu dois générer:
            - Un titre SEO (60 caractères max)
            - Une description SEO (160 caractères max)
            - Un slug URL-friendly basé sur le titre
            - Un extrait accrocheur (200-300 caractères)
            - Un titre optimisé si nécessaire
            
            Format de réponse attendu:
            TITRE: [titre optimisé]
            SLUG: [slug]
            EXTRAIT: [extrait]
            META_TITRE: [meta title]
            META_DESCRIPTION: [meta description]`
          },
          {
            role: 'user',
            content: `Génère les métadonnées SEO pour cet article dont le titre est "${title}" et le contenu est : ${content}`
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

    // Parse the response to extract all fields
    const response = data.choices[0].message.content
    const title_match = response.match(/TITRE: (.*)/i)?.[1] || ''
    const slug_match = response.match(/SLUG: (.*)/i)?.[1] || ''
    const excerpt_match = response.match(/EXTRAIT: (.*)/i)?.[1] || ''
    const metaTitle_match = response.match(/META_TITRE: (.*)/i)?.[1] || ''
    const metaDescription_match = response.match(/META_DESCRIPTION: (.*)/i)?.[1] || ''

    return new Response(JSON.stringify({ 
      title: title_match,
      slug: slug_match,
      excerpt: excerpt_match,
      metaTitle: metaTitle_match,
      metaDescription: metaDescription_match
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in generate-seo function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})