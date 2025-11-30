import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ClientCategories } from '../types';
import { discoveryChannelEnum, urgencyEnum, painPointEnum, volumeRangeEnum, solutionPartEnum, usefulAddonEnum, industryEnum, integrationNeedsEnum } from '../utils/enums';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const ClientCategorySchema = z.object({
    industry: industryEnum,
    nicheIndustry: z.string(),
    companySize: z.string(),
    painPoint: painPointEnum,
    painPointDescription: z.string(),
    discoveryChannel: discoveryChannelEnum,
    nicheDiscoveryChannel: z.string(),
    urgency: urgencyEnum,
    budgetIndicator: z.string(),
    estimatedVolume: z.number(),
    integrationNeeds: integrationNeedsEnum,
    byVolume: volumeRangeEnum,
    solutionPart: solutionPartEnum,
    usefulAddons: z.array(usefulAddonEnum),
});

const systemPrompt = `
Eres un experto analista de ventas.
Analiza la información del cliente y devuelve SIEMPRE todos los campos del esquema:
- industry (categoría general. Que la categoria sea Ecommerce y Retail para tiendas que caigan en esta categoria.)
- nicheIndustry (nicho o subindustria)
- companySize
- painPoint (problema principal)
- painPointDescription (descripción del problema principal)
- discoveryChannel (Opciones: Búsqueda Orgánica, Redes Sociales, Prospección Directa, Referimiento, Partner Comercial, Evento, Contenido, Marketplace, Prueba de Producto)
- nicheDiscoveryChannel (canal o detalle específico: campaña, evento, referencia)
- urgency
- budgetIndicator
- estimatedVolume
- integrationNeeds (CRM, ERP, API, SDK; si no aplica usa "N/A". Si es API y CRM pon API, CRM, si es API y ERP pon API, ERP, si es API y SDK pon API, SDK, si es CRM y ERP pon CRM, ERP, si es CRM y SDK pon CRM, SDK, si es ERP y SDK pon ERP, SDK, si es API, CRM y ERP pon API, CRM, ERP, si es API, CRM y SDK pon API, CRM, SDK, si es API, ERP y SDK pon API, ERP, SDK, si es CRM, ERP y SDK pon CRM, ERP, SDK, si es API, CRM, ERP y SDK pon API, CRM, ERP, SDK)
- byVolume ("0-50", "51-100", "101-200", "201-500", "500+")
- solutionPart (Vambe AI: para hablar con clientes, generar leads y otros; Vambe Ads: publicidad; Vambe Connect: integraciones)
- usefulAddons (array de addons que se probablemente le sirven mucho al cliente. Opciones: "Llamadas en vambe", "Comentarios en instagram", "Generador de PDF con IA", "Gmail: Envio de correaos con IA", "Razones de perdida en tickets", "NPS con IA", "Formulas Matematicas con IA". Puede ser un array vacío si no se vendió ningún addon)

Formato:
- Respuestas cortas, en español, con la primera letra en mayúscula.
- Usa un número entero para estimatedVolume.
`.trim();

export const llmClientCategorization = async (prompt: string): Promise<ClientCategories> => {
    const completion = await openai.chat.completions.parse({
      model: "gpt-5.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      response_format: zodResponseFormat(ClientCategorySchema, "client_categorization"),
    });
    
    return completion.choices[0].message.parsed as ClientCategories;
};

const IndustrySchema = z.object({
    industry: z.string(),
});

const industrySystemPrompt = `
Eres un experto analista de ventas.
Analiza la descripción del cliente y determina su industria principal.
Responde solo con la industria en español, con la primera letra en mayúscula.
(categoría general. Que la categoria sea Ecommerce y Retail para tiendas que caigan en esta categoria)
`.trim();

export const llmGetIndustry = async (prompt: string): Promise<string> => {
    const completion = await openai.chat.completions.parse({
        model: "gpt-5.1",
        messages: [
            { role: "system", content: industrySystemPrompt },
            { role: "user", content: prompt }
        ],
        response_format: zodResponseFormat(IndustrySchema, "industry_extraction"),
    });
    
    const parsed = completion.choices[0].message.parsed;
    if (!parsed) {
        throw new Error('No se pudo extraer la industria del cliente');
    }
    
    return parsed.industry;
};

