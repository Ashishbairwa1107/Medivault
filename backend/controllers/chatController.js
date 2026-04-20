const ChatLog = require('../models/ChatLog');

// Configuration for MediVault Assistant
const SYSTEM_KNOWLEDGE = {
    introduction: "I am your MediVault Assistant. I can help you navigate our Digital Healthcare Platform.",
    platform_desc: "MediVault is a unified healthcare ecosystem where patients can securely store medical records, and doctors can access them with consent for better consultations.",
    patient_records: "Patients can view their timeline of medical records under the 'My Records' section. All records are end-to-end encrypted.",
    doctor_consultation: "Doctors can view a patient's history once the patient grants access. They can also upload digital prescriptions and clinical notes.",
    consent: "Patient consent is the heart of MediVault. You have full control over who sees your data and for how long. You can revoke access at any time.",
    hospital_access: "Hospitals can register their staff and manage doctors. They can search for patients and request emergency access if necessary.",
};

const getAIResponse = async (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('what is') || msg.includes('about')) {
        return SYSTEM_KNOWLEDGE.platform_desc;
    }
    if (msg.includes('medical record') || msg.includes('my data')) {
        return SYSTEM_KNOWLEDGE.patient_records;
    }
    if (msg.includes('consent') || msg.includes('permission')) {
        return SYSTEM_KNOWLEDGE.consent;
    }
    if (msg.includes('doctor') || msg.includes('prescription')) {
        return SYSTEM_KNOWLEDGE.doctor_consultation;
    }
    if (msg.includes('hospital')) {
        return SYSTEM_KNOWLEDGE.hospital_access;
    }
    if (msg.includes('hello') || msg.includes('hi')) {
        return "Hello! " + SYSTEM_KNOWLEDGE.introduction + " How can I assist you today?";
    }

    return "That's an interesting question. MediVault is designed to make healthcare seamless. For specific features like " + 
           "consent management or record viewing, please check your respective dashboard.";
};

exports.processMessage = async (req, res) => {
    try {
        const { message, sessionId, userId } = req.body;

        if (!message || !sessionId) {
            return res.status(400).json({ error: 'Message and sessionId are required' });
        }

        // 1. Get Simulated AI Response
        const aiResponse = await getAIResponse(message);

        // 2. Find or Create Chat Log
        let chatLog = await ChatLog.findOne({ sessionId });

        if (!chatLog) {
            chatLog = new ChatLog({
                sessionId,
                userId: userId || null,
                messages: []
            });
        }

        // 3. Add Messages to Log
        chatLog.messages.push({ role: 'user', content: message });
        chatLog.messages.push({ role: 'assistant', content: aiResponse });

        await chatLog.save();

        res.json({
            reply: aiResponse,
            messages: chatLog.messages
        });

    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { sessionId } = req.query;
        const chatLog = await ChatLog.findOne({ sessionId });
        
        if (!chatLog) {
            return res.json({ messages: [] });
        }

        res.json({ messages: chatLog.messages });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
