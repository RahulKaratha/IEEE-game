const API_BASE_URL = "/api";

export async function calculateTax(formData) {
  const response = await fetch(`${API_BASE_URL}/calculate-tax`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server Error:", errorText);
    throw new Error(`Failed to calculate tax: ${errorText}`);
  }

  return response.json();
}

export async function chatWithAI(payload) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Chat request failed");
  }

  return response.json();
}

export async function getAIAdvice(payload) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("AI advice failed");
  }

  return response.json();
}
