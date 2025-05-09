import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Asegúrate que tu clave esté en tu .env
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // puedes usar gpt-4 si tienes acceso
        messages: [
          {
            role: "system",
            content: "Eres una profesora de inglés amigable llamada June. Responde de manera corta y educativa para ayudar a practicar inglés.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.6, // puedes ajustar si quieres respuestas más creativas o serias
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Lo siento, no entendí eso.";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("❌ Error al conectarse a ChatGPT:", error);
    return NextResponse.json({ reply: "Ocurrió un error procesando tu mensaje." }, { status: 500 });
  }
}
