import React, { useState, useEffect } from 'react';

export default function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");

    // Función para cargar mensajes del historial cuando el componente se monta
    useEffect(() => {
        async function fetchMessages() {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/messages");
                const data = await response.json();
                setMessages(data); // Guardar los mensajes en el estado
            } catch (error) {
                console.error("Error al cargar mensajes:", error);
            }
        }

        fetchMessages();
    }, []);

    // Función para enviar el mensaje a la API
    async function enviarMensaje() {
        if (!userInput) return;

        // Añadir el mensaje del usuario a los mensajes
        setMessages([...messages, { sender: "user", text: userInput }]);
        setUserInput("");

        try {
            const response = await fetch("http://127.0.0.1:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput })
            });
            const data = await response.json();

            if (data.reply) {
                setMessages(prevMessages => [...prevMessages, { sender: "bot", text: data.reply }]);
            } else {
                setMessages(prevMessages => [...prevMessages, { sender: "bot", text: "Error: " + data.error }]);
            }
        } catch (error) {
            console.error("Error de conexión:", error.message);
            setMessages(prevMessages => [...prevMessages, { sender: "bot", text: "Error de conexión: " + error.message }]);
        }
    }

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
            <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "10px" }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
                        <p style={{
                            backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#FFF",
                            padding: "10px",
                            borderRadius: "8px",
                            display: "inline-block",
                            maxWidth: "80%",
                            wordWrap: "break-word"
                        }}>
                            {msg.text}
                        </p>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                style={{ width: "80%", padding: "10px", borderRadius: "8px", marginRight: "5px" }}
            />
            <button onClick={enviarMensaje} style={{ padding: "10px 15px", borderRadius: "8px", backgroundColor: "#007bff", color: "#fff" }}>
                Enviar
            </button>
        </div>
    );
}
