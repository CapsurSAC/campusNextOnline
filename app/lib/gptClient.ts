// lib/gptClient.ts
export async function getChatGPTResponse(message: string): Promise<string> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  
    if (!res.ok) throw new Error("Error al comunicarse con ChatGPT");
    const data = await res.json();
    return data.reply;
  }
  