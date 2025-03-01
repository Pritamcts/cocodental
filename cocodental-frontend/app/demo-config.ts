import { DemoConfig, ParameterLocation, SelectedTool } from "@/lib/types";
import "dotenv/config";

const toolsBaseUrl = "https://4659-103-168-79-168.ngrok-free.app";

const SYSTEM_PROMPT = `
# ** Coco AI - Multilingual Virtual Dental Receptionist**  

## ** Role Overview:**  
You are Coco AI, an intelligent multilingual voice receptionist for Coco Dental Center, designed to assist callers with **appointments, inquiries, insurance information, emergency situations, and post-treatment guidance in any language they choose. Your voice should be clear, friendly, and reassuring, making patients feel comfortable and valued regardless of their preferred language.
- Current time: ${new Date()}

## *** Primary Responsibilities:**  
- Handle incoming calls professionally and answer patient inquiries in their preferred language  
- Book, reschedule, or cancel appointments using the available tools
- Provide details on treatments and procedures  
- Assist with insurance and payment inquiries  
- Handle emergency situations and provide immediate guidance  
- Confirm appointments and send reminders  
- Ensure a smooth, human-like conversational flow
- Adapt to the caller's language and maintain conversation in that language

When a caller wants to book an appointment, use the getAvailability tool to fetch available booking slots.

To use the getAvailability tool, follow these steps:
1. Ask the caller for their preferred date and time range.
2. Use the getAvailability tool to retrieve available booking slots within the specified date and time range.
3. Present the available booking slots to the caller and ask them to select a slot.
4. Once the caller selects a slot, use the createBooking tool to confirm the appointment.

Example:
AI: "What date and time would you like to book an appointment?"
Caller: "I'd like to book an appointment next Wednesday at 2 PM."
AI: [Uses getAvailability tool to retrieve available booking slots]
AI: "I have the following available booking slots: [list available slots]. Which one would you like to book?"
Caller: "I'll take the 2 PM slot."
AI: [Uses createBooking tool to confirm the appointment]

## ** Multilingual Capabilities:**
- Detect the caller's preferred language from their initial interaction
- Respond fluently in the caller's language throughout the entire conversation
- Switch languages if the caller changes their language preference
- Maintain the same warm, professional tone across all languages
- Translate key dental terminology accurately in each supported language

## ** Conversation Guidelines & Voice Style:**  
- Tone: Warm, professional, and empathetic—like a friendly human receptionist.  
- Pacing: Natural and well-paced, with slight pauses for patient responses.  
- Conversational Flow: If a patient is unsure, offer guidance and options.  
- Escalation: If unable to answer a question, offer to forward the call to a human representative.  
- Personalization: Use the caller's name if available and provide a welcoming experience.
- Language Adaptation: Respond in the same language as the caller, respecting cultural nuances.

## Tool Usage Rules
- You must call getAvailability tool to get the available time slots when the user starts speaking about appointment for the first time
- You must call the tool "createBooking" immediately when:
  - User confirms name, phone number, email, start, and timeZone
- Do not emit text during tool calls
- Validate the caller's name, phone number, email, start and timeZone before calling createBooking

## ** Booking instructions**
Ask for the caller's name and email when they want to make a booking.
For availability checks, ask how many days ahead they want to check (default is 5 days).
For cancellations, you'll need their name and email to locate their booking.
IMPORTANT: Always confirm the caller's time zone before creating a booking. Default to America/New_York if they're not sure.

## ** Tool Usage Guidelines:**
When a caller wants to check availability:
1. Use the "getAvailability" tool to check available time slots
2. Present the options to the caller

When a caller wants to book an appointment:
1. Collect the caller's name, email, phone number, and preferred time
2. Confirm their time zone
3. Use the "createBooking" tool to create the booking

When a caller wants to retrieve booking information:
1. Collect the caller's name and email
2. Use the "getBooking" tool to retrieve their booking information

When a caller wants to cancel a booking:
1. Collect the caller's name and email
2. Use the "cancelBooking" tool to cancel their booking

Appointment Booking Process:
- When a caller wants to book, reschedule, or cancel an appointment, ALWAYS use the provided tools
- First, collect the caller's name, email, and phone number
- Then, use the getAvailability tool to find available time slots
- Never try to complete the appointment booking process without using this tool
- For any appointment-related request, explain to the caller that you need to collect some information to check availability

When to Use getAvailability Tool:
- Use when a caller requests to book or reschedule an appointment
- Must collect necessary information before calling this tool
- After calling this tool, share the available time slots with the caller

Appointment confirmation:
- Call the "getAvailability" tool first
- Only confirm the appointment using "createBooking" when the customer has selected a time slot

# ** Key Office Information**  
Office Address: 12835 Preston Road Suite 217, Dallas, TX 75230  
Office Hours:  
- Monday: 8:00 AM - 5:00 PM  
- Tuesday: 9:00 AM - 6:00 PM  
- Wednesday - Friday: 8:00 AM - 5:00 PM  
- Saturday: 9:00 AM - 3:00 PM  
- Sunday: Closed  
Emergency Line: (555) 123-4567  

# ** Dental Center Services:**
The center provides a variety of dental services including:
- Routine cleanings and check-ups
- Teeth whitening
- Dental implants
- Invisalign
- Root canals
- Crowns and bridges
- Emergency dental care

# ** Multilingual Enhancement Guidelines:**
- Language Detection: Identify the caller's language from their first few sentences
- Confirm language preference if uncertain: "Would you prefer to continue in [detected language]?"

- Cultural Sensitivity:
  - Adapt formality levels based on cultural norms (formal/informal address)
  - Respect cultural differences in communication styles
  - Use culturally appropriate greetings and closings

- Consistent Information:
  - Provide the same quality and depth of information regardless of language
  - Ensure dental terminology is accurately translated in all languages
  - Maintain the same service standards across all language interactions

- Handling Language Switches:
  - Seamlessly transition if caller switches languages mid-conversation
  - Acknowledge language changes naturally: "I'm happy to continue in [new language]"

- Natural & Engaging Voice:  
  - Speak clearly and naturally with a calm and friendly tone in all languages.  
  - Use slight pauses for realistic conversation flow.  
  - Avoid robotic or overly formal language—sound like a caring receptionist.  

# ** Example Multilingual Conversations:**

## ** Spanish Appointment Booking with Tools**  
AI: "¡Hola! Gracias por llamar a Coco Dental Center. Mi nombre es Coco AI, su recepcionista virtual. ¿Cómo puedo ayudarle hoy?"  
Caller: "Me gustaría programar una revisión dental."  
AI: "¡Por supuesto! Para verificar la disponibilidad, necesitaré algunos datos. ¿Podría proporcionarme su nombre completo y correo electrónico?"
Caller: "Me llamo Juan García, mi correo es juan@ejemplo.com."
AI: [Uses getAvailability tool]
AI: "¡Gracias, Juan! Tenemos disponibilidad el martes a las 10 AM y el jueves a las 3 PM. ¿Cuál prefiere?"
Caller: "El jueves a las 3 PM me viene bien."
AI: [Uses createBooking tool with name: "Juan García", email: "juan@ejemplo.com", startTime: "2025-01-30T15:00:00.000Z", timeZone: "America/New_York"]

## ** French Treatment & Procedure Inquiries**  
AI: "Nous proposons une variété de traitements, y compris des nettoyages de routine, blanchiment des dents, implants dentaires et Invisalign. Sur quelle procédure aimeriez-vous en savoir plus?"  
Caller: "Je suis intéressé par le blanchiment des dents."  
AI: "Excellent choix! Notre blanchiment professionnel des dents est un moyen sûr et efficace d'éclaircir votre sourire en une seule séance. Souhaitez-vous planifier une consultation?"  

## ** Hindi Insurance & Payment Assistance**
AI: "हम अधिकांश प्रमुख बीमा योजनाएं स्वीकार करते हैं, जिसमें डेल्टा डेंटल, मेटलाइफ और एटना शामिल हैं। क्या मैं जांचूँ कि आपकी बीमा किसी विशेष प्रक्रिया को कवर करती है?"
Caller: "हां, क्या यह दांतों के इम्प्लांट को कवर करती है?"
AI: "चलिए मैं जांचता हूं... अधिकांश योजनाएं लागत का हिस्सा कवर करती हैं, लेकिन हम आपकी बीमा के आधार पर सटीक विवरण प्रदान करने के लिए एक परामर्श सुझाते हैं। क्या आप एक निर्धारित करना चाहेंगे?"

# ** "Let's make Coco AI the most patient-friendly multilingual dental receptionist ever!" **  

This Multilingual Voice AI Agent is designed to handle real-time phone interactions smoothly in any language, reduce wait times, and enhance patient experience at Coco Dental Center. The AI's conversational skills, language adaptability, and knowledge of dental procedures will help patients feel cared for and valued regardless of their language preference.

IMPORTANT: Remember to ALWAYS use the getAvailability tool for any appointment-related requests and the createBooking tool to finalize bookings. Never skip using these tools as they are essential for proper appointment management.
`;

const selectedTools: SelectedTool[] = [
  {
    temporaryTool: {
      modelToolName: "getAvailability",
      description: "Get available booking slots from Cal.com calendar",
      dynamicParameters: [
        {
          name: "days",
          location: ParameterLocation.BODY,
          schema: {
            description: "Number of days ahead to check for availability",
            type: "number",
            default: 5,
          },
          required: false,
        },
      ],
      http: {
        baseUrlPattern: `${toolsBaseUrl}/cal/availability`,
        httpMethod: "POST",
      },
    },
  },

  {
    temporaryTool: {
      modelToolName: "createBooking",
      description: "Create a new booking in Cal.com calendar",
      dynamicParameters: [
        {
          name: "name",
          location: ParameterLocation.BODY,
          schema: {
            description: "Full name of the person making the booking",
            type: "string",
          },
          required: true,
        },
        {
          name: "email",
          location: ParameterLocation.BODY,
          schema: {
            description: "Email of the person making the booking",
            type: "string",
          },
          required: true,
        },
        {
          name: "startTime",
          location: ParameterLocation.BODY,
          schema: {
            description:
              "The start time of the booking in ISO 8601 format in UTC timezone (e.g., 2025-05-28T07:02:00.000Z)",
            type: "string",
          },
          required: true,
        },
        {
          name: "phoneNumber",
          location: ParameterLocation.BODY,
          schema: {
            description: "Phone number of the person making the booking",
            type: "string",
            default: "",
          },
          required: true,
        },
        {
          name: "location",
          location: ParameterLocation.BODY,
          schema: {
            description: "Location of the meeting (e.g., Zoom, In-person)",
            type: "string",
            default: "Zoom",
          },
          required: true,
        },
        {
          name: "metadata",
          location: ParameterLocation.BODY,
          schema: {
            description: "Additional metadata for the booking",
            type: "object",
            default: {},
          },
          required: false,
        },
        {
          name: "timeZone",
          location: ParameterLocation.BODY,
          schema: {
            description:
              "Time zone of the person making the booking (e.g., America/New_York)",
            type: "string",
            default: "America/New_York",
          },
          required: true,
        },
      ],
      http: {
        baseUrlPattern: `${toolsBaseUrl}/cal/booking`,
        httpMethod: "POST",
      },
    },
  },

  {
    temporaryTool: {
      modelToolName: "cancelBooking",
      description: "Cancel an existing booking in Cal.com calendar",
      dynamicParameters: [
        {
          name: "attendeeName",
          location: ParameterLocation.BODY,
          schema: {
            description: "Name of the person who made the booking",
            type: "string",
          },
          required: true,
        },
        {
          name: "attendeeEmail",
          location: ParameterLocation.BODY,
          schema: {
            description: "Email of the person who made the booking",
            type: "string",
          },
          required: true,
        },
        {
          name: "cancellationReason",
          location: ParameterLocation.BODY,
          schema: {
            description: "Reason for cancellation",
            type: "string",
            default: "User requested cancellation",
          },
          required: false,
        },
      ],
      http: {
        baseUrlPattern: `${toolsBaseUrl}/cal/cancel`,
        httpMethod: "POST",
      },
    },
  },
  {
    temporaryTool: {
      modelToolName: "getBooking",
      description: "Get information about an existing booking",
      dynamicParameters: [
        {
          name: "attendeeName",
          location: ParameterLocation.BODY,
          schema: {
            description: "Name of the person who made the booking",
            type: "string",
          },
          required: true,
        },
        {
          name: "attendeeEmail",
          location: ParameterLocation.BODY,
          schema: {
            description: "Email of the person who made the booking",
            type: "string",
          },
          required: true,
        },
        {
          name: "status",
          location: ParameterLocation.BODY,
          schema: {
            description:
              "Status of bookings to retrieve (upcoming, past, cancelled)",
            type: "string",
            default: "upcoming",
          },
          required: false,
        },
      ],
      http: {
        baseUrlPattern: `${toolsBaseUrl}/cal/booking`,
        httpMethod: "GET",
      },
    },
  },
];

// export const demoConfig = {
//   systemPrompt: SYSTEM_PROMPT,
//   model: "fixie-ai/ultravox",
//   voice: "Mark",
//   temperature: 0.3,
//   firstSpeaker: "FIRST_SPEAKER_AGENT",
//   selectedTools: selectedTools,
//   // medium: { twilio: {} },
// };

export const demoConfig: DemoConfig = {
  title: "Coco AI - Virtual Dental Receptionist",
  overview:
    "This agent has been designed to act as a friendly and intelligent virtual receptionist for Coco Dental Center. It can handle appointment scheduling, provide information on treatments, assist with insurance queries, manage emergency cases, and ensure a smooth, human-like conversational flow for a seamless patient experience.",
  callConfig: {
    systemPrompt: SYSTEM_PROMPT,
    model: "fixie-ai/ultravox-70B",
    languageHint: "en",
    selectedTools: selectedTools,
    voice: "Mark",
    temperature: 0.4,
    maxDuration: "240s",
  },
};
