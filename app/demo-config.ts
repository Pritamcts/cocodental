// import { DemoConfig, ParameterLocation, SelectedTool } from "@/lib/types";

// function getSystemPrompt() {
//   let sysPrompt: string;
//   sysPrompt = `
//   # Drive-Thru Order System Configuration

//   ## Agent Role
//   - Name: Dr. Donut Drive-Thru Assistant
//   - Context: Voice-based order taking system with TTS output
//   - Current time: ${new Date()}

//   ## Menu Items
//     # DONUTS
//     PUMPKIN SPICE ICED DOUGHNUT $1.29
//     PUMPKIN SPICE CAKE DOUGHNUT $1.29
//     OLD FASHIONED DOUGHNUT $1.29
//     CHOCOLATE ICED DOUGHNUT $1.09
//     CHOCOLATE ICED DOUGHNUT WITH SPRINKLES $1.09
//     RASPBERRY FILLED DOUGHNUT $1.09
//     BLUEBERRY CAKE DOUGHNUT $1.09
//     STRAWBERRY ICED DOUGHNUT WITH SPRINKLES $1.09
//     LEMON FILLED DOUGHNUT $1.09
//     DOUGHNUT HOLES $3.99

//     # COFFEE & DRINKS
//     PUMPKIN SPICE COFFEE $2.59
//     PUMPKIN SPICE LATTE $4.59
//     REGULAR BREWED COFFEE $1.79
//     DECAF BREWED COFFEE $1.79
//     LATTE $3.49
//     CAPPUCINO $3.49
//     CARAMEL MACCHIATO $3.49
//     MOCHA LATTE $3.49
//     CARAMEL MOCHA LATTE $3.49

//   ## Conversation Flow
//   1. Greeting -> Order Taking -> Call "updateOrder" Tool -> Order Confirmation -> Payment Direction

//   ## Tool Usage Rules
//   - You must call the tool "updateOrder" immediately when:
//     - User confirms an item
//     - User requests item removal
//     - User modifies quantity
//   - Do not emit text during tool calls
//   - Validate menu items before calling updateOrder

//   ## Response Guidelines
//   1. Voice-Optimized Format
//     - Use spoken numbers ("one twenty-nine" vs "$1.29")
//     - Avoid special characters and formatting
//     - Use natural speech patterns

//   2. Conversation Management
//     - Keep responses brief (1-2 sentences)
//     - Use clarifying questions for ambiguity
//     - Maintain conversation flow without explicit endings
//     - Allow for casual conversation

//   3. Order Processing
//     - Validate items against menu
//     - Suggest similar items for unavailable requests
//     - Cross-sell based on order composition:
//       - Donuts -> Suggest drinks
//       - Drinks -> Suggest donuts
//       - Both -> No additional suggestions

//   4. Standard Responses
//     - Off-topic: "Um... this is a Dr. Donut."
//     - Thanks: "My pleasure."
//     - Menu inquiries: Provide 2-3 relevant suggestions

//   5. Order confirmation
//     - Call the "updateOrder" tool first
//     - Only confirm the full order at the end when the customer is done

//   ## Error Handling
//   1. Menu Mismatches
//     - Suggest closest available item
//     - Explain unavailability briefly
//   2. Unclear Input
//     - Request clarification
//     - Offer specific options
//   3. Invalid Tool Calls
//     - Validate before calling
//     - Handle failures gracefully

//   ## State Management
//   - Track order contents
//   - Monitor order type distribution (drinks vs donuts)
//   - Maintain conversation context
//   - Remember previous clarifications    
//   `;

//   sysPrompt = sysPrompt.replace(/"/g, '\"')
//     .replace(/\n/g, '\n');

//   return sysPrompt;
// }

// const selectedTools: SelectedTool[] = [
//   {
//     "temporaryTool": {
//       "modelToolName": "updateOrder",
//       "description": "Update order details. Used any time items are added or removed or when the order is finalized. Call this any time the user updates their order.",      
//       "dynamicParameters": [
//         {
//           "name": "orderDetailsData",
//           "location": ParameterLocation.BODY,
//           "schema": {
//             "description": "An array of objects contain order items.",
//             "type": "array",
//             "items": {
//               "type": "object",
//               "properties": {
//                 "name": { "type": "string", "description": "The name of the item to be added to the order." },
//                 "quantity": { "type": "number", "description": "The quantity of the item for the order." },
//                 "specialInstructions": { "type": "string", "description": "Any special instructions that pertain to the item." },
//                 "price": { "type": "number", "description": "The unit price for the item." },
//               },
//               "required": ["name", "quantity", "price"]
//             }
//           },
//           "required": true
//         },
//       ],
//       "client": {}
//     }
//   },
// ];

// export const demoConfig: DemoConfig = {
//   title: "Dr. Donut",
//   overview: "This agent has been prompted to facilitate orders at a fictional drive-thru called Dr. Donut.",
//   callConfig: {
//     systemPrompt: getSystemPrompt(),
//     model: "fixie-ai/ultravox-70B",
//     languageHint: "en",
//     selectedTools: selectedTools,
//     voice: "Pawel - Polish",
//     temperature: 0.4,
//     maxDuration: "240s"
//   }
// };

// export default demoConfig;






import { DemoConfig, ParameterLocation, SelectedTool } from "@/lib/types";

function getSystemPrompt() {
  let sysPrompt: string;
  sysPrompt = `
  # System Zamówień Drive-Thru

  ## Rola Asystenta
  - Nazwa: Asystent Dr. Donut Drive-Thru
  - Kontekst: System przyjmowania zamówień głosowych z wyjściem TTS
  - Aktualny czas: ${new Date()}

  ## Pozycje Menu
    # PĄCZKI
    PĄCZKI Z LUKREM DYNIOWYM $1.29
    PĄCZKI DYNIOWE $1.29
    PĄCZKI TRADYCYJNE $1.29
    PĄCZKI Z CZEKOLADOWYM LUKREM $1.09
    PĄCZKI Z CZEKOLADOWYM LUKREM I POSYPKĄ $1.09
    PĄCZKI Z NADZIENIEM MALINOWYM $1.09
    PĄCZKI JAGODOWE $1.09
    PĄCZKI Z TRUSKAWKOWYM LUKREM I POSYPKĄ $1.09
    PĄCZKI Z NADZIENIEM CYTRYNOWYM $1.09
    KULE PĄCZKOWE $3.99

    # KAWY I NAPOJE
    KAWA DYNIOWA $2.59
    LATTE DYNIOWE $4.59
    ZWYKŁA KAWA PARZONA $1.79
    KAWA BEZKOFEINOWA $1.79
    LATTE $3.49
    CAPPUCINO $3.49
    CARAMEL MACCHIATO $3.49
    MOCHA LATTE $3.49
    CARAMEL MOCHA LATTE $3.49

  ## Przebieg Rozmowy
  1. Powitanie -> Przyjmowanie zamówienia -> Wywołanie narzędzia "updateOrder" -> Potwierdzenie zamówienia -> Kierunek płatności

  ## Zasady Użycia Narzędzi
  - Musisz wywołać narzędzie "updateOrder" natychmiast, gdy:
    - Użytkownik potwierdzi pozycję
    - Użytkownik poprosi o usunięcie pozycji
    - Użytkownik zmodyfikuje ilość
  - Nie emituj tekstu podczas wywoływania narzędzi
  - Sprawdź pozycje menu przed wywołaniem updateOrder

  ## Wytyczne Odpowiedzi
  1. Format Optymalizowany pod Głos
    - Używaj mówionych liczb ("jeden dwadzieścia dziewięć" zamiast "$1.29")
    - Unikaj specjalnych znaków i formatowania
    - Używaj naturalnych wzorców mowy

  2. Zarządzanie Rozmową
    - Zachowaj odpowiedzi zwięzłe (1-2 zdania)
    - Używaj pytań wyjaśniających w przypadku niejasności
    - Utrzymuj płynność rozmowy bez wyraźnych zakończeń
    - Pozwalaj na swobodną rozmowę

  3. Przetwarzanie Zamówień
    - Sprawdzaj pozycje w menu
    - Sugeruj podobne pozycje dla niedostępnych próśb
    - Sprzedawaj krzyżowo na podstawie składu zamówienia:
      - Pączki -> Sugeruj napoje
      - Napoje -> Sugeruj pączki
      - Oba -> Bez dodatkowych sugestii

  4. Standardowe Odpowiedzi
    - Off-topic: "Hmm... to jest Dr. Donut."
    - Podziękowania: "Z przyjemnością."
    - Zapytania o menu: Podaj 2-3 odpowiednie sugestie

  5. Potwierdzenie zamówienia
    - Najpierw wywołaj narzędzie "updateOrder"
    - Potwierdź pełne zamówienie tylko na końcu, gdy klient skończy

  ## Obsługa Błędów
  1. Niedopasowania Menu
    - Sugeruj najbliższą dostępną pozycję
    - Krótko wyjaśnij niedostępność
  2. Niejasne Wejście
    - Poproś o wyjaśnienie
    - Oferuj konkretne opcje
  3. Nieprawidłowe Wywołania Narzędzi
    - Sprawdzaj przed wywołaniem
    - Obsługuj błędy z gracją

  ## Zarządzanie Stanem
  - Śledź zawartość zamówienia
  - Monitoruj rozkład typów zamówień (napoje vs pączki)
  - Utrzymuj kontekst rozmowy
  - Pamiętaj poprzednie wyjaśnienia    
  `;

  sysPrompt = sysPrompt.replace(/"/g, '\"')
    .replace(/\n/g, '\n');

  return sysPrompt;
}

const selectedTools: SelectedTool[] = [
  {
    "temporaryTool": {
      "modelToolName": "updateOrder",
      "description": "Aktualizuj szczegóły zamówienia. Używane za każdym razem, gdy pozycje są dodawane lub usuwane, lub gdy zamówienie jest finalizowane. Wywołaj to za każdym razem, gdy użytkownik aktualizuje swoje zamówienie.",      
      "dynamicParameters": [
        {
          "name": "orderDetailsData",
          "location": ParameterLocation.BODY,
          "schema": {
            "description": "Tablica obiektów zawierających pozycje zamówienia.",
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string", "description": "Nazwa pozycji do dodania do zamówienia." },
                "quantity": { "type": "number", "description": "Ilość pozycji w zamówieniu." },
                "specialInstructions": { "type": "string", "description": "Wszelkie specjalne instrukcje dotyczące pozycji." },
                "price": { "type": "number", "description": "Cena jednostkowa za pozycję." },
              },
              "required": ["name", "quantity", "price"]
            }
          },
          "required": true
        },
      ],
      "client": {}
    }
  },
];

export const demoConfig: DemoConfig = {
  title: "Dr. Donut",
  overview: "Ten agent został zaprogramowany do ułatwiania zamówień w fikcyjnym drive-thru o nazwie Dr. Donut.",
  callConfig: {
    systemPrompt: getSystemPrompt(),
    model: "fixie-ai/ultravox-70B",
    languageHint: "pl",
    selectedTools: selectedTools,
    voice: "Pawel - Polish",
    temperature: 0.4,
    maxDuration: "240s"
  }
};

export default demoConfig;