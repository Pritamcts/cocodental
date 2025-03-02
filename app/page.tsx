"use client";

// import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { startCall, endCall } from '@/lib/callFunctions'
// import { CallConfig, SelectedTool } from '@/lib/types'
// import demoConfig from './demo-config';
// import { Role, Transcript, UltravoxExperimentalMessageEvent, UltravoxSessionStatus } from 'ultravox-client';
// import BorderedImage from '@/app/components/BorderedImage';
// import UVLogo from '@/public/UVMark-White.svg';
// import CallStatus from './components/CallStatus';
// import DebugMessages from '@/app/components/DebugMessages';
// import MicToggleButton from './components/MicToggleButton';
// import { PhoneOffIcon } from 'lucide-react';
// // import OrderDetails from './components/OrderDetails';
// import Image from "next/image";
// // import UVLogo from '@/public/UVHorizontal-White.svg';

// type SearchParamsProps = {
//   showMuteSpeakerButton: boolean;
//   modelOverride: string | undefined;
//   showDebugMessages: boolean;
//   showUserTranscripts: boolean;
// };

// type SearchParamsHandlerProps = {
//   children: (props: SearchParamsProps) => React.ReactNode;
// };

// function SearchParamsHandler({ children }: SearchParamsHandlerProps) {
//   const searchParams = useSearchParams();
//   const showMuteSpeakerButton = searchParams.get('showSpeakerMute') === 'true';
//   const showDebugMessages = searchParams.get('showDebugMessages') === 'true';
//   const showUserTranscripts = searchParams.get('showUserTranscripts') === 'true';
//   let modelOverride: string | undefined;

//   if (searchParams.get('model')) {
//     modelOverride = "fixie-ai/" + searchParams.get('model');
//   }

//   return children({ showMuteSpeakerButton, modelOverride, showDebugMessages, showUserTranscripts });
// }

// export default function Home() {
//   const [isCallActive, setIsCallActive] = useState(false);
//   const [agentStatus, setAgentStatus] = useState<string>('off');
//   const [callTranscript, setCallTranscript] = useState<Transcript[] | null>([]);
//   const [callDebugMessages, setCallDebugMessages] = useState<UltravoxExperimentalMessageEvent[]>([]);
//   const [customerProfileKey, setCustomerProfileKey] = useState<string | null>(null);
//   const transcriptContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (transcriptContainerRef.current) {
//       transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
//     }
//   }, [callTranscript]);

//   const handleStatusChange = useCallback((status: UltravoxSessionStatus | string | undefined) => {
//     if(status) {
//       setAgentStatus(status);
//     } else {
//       setAgentStatus('off');
//     }
//   }, []);

//   const handleTranscriptChange = useCallback((transcripts: Transcript[] | undefined) => {
//     if(transcripts) {
//       setCallTranscript([...transcripts]);
//     }
//   }, []);

//   const handleDebugMessage = useCallback((debugMessage: UltravoxExperimentalMessageEvent) => {
//     setCallDebugMessages(prevMessages => [...prevMessages, debugMessage]);
//   }, []);

//   const clearCustomerProfile = useCallback(() => {
//     setCustomerProfileKey(prev => prev ? `${prev}-cleared` : 'cleared');
//   }, []);

//   const handleStartCallButtonClick = async (modelOverride?: string, showDebugMessages?: boolean) => {
//     try {
//       handleStatusChange('Starting call...');
//       setCallTranscript(null);
//       setCallDebugMessages([]);
//       clearCustomerProfile();

//       const newKey = `call-${Date.now()}`;
//       setCustomerProfileKey(newKey);

//       let callConfig: CallConfig = {
//         systemPrompt: demoConfig.callConfig.systemPrompt,
//         model: modelOverride || demoConfig.callConfig.model,
//         languageHint: demoConfig.callConfig.languageHint,
//         voice: demoConfig.callConfig.voice,
//         temperature: demoConfig.callConfig.temperature,
//         maxDuration: demoConfig.callConfig.maxDuration,
//         timeExceededMessage: demoConfig.callConfig.timeExceededMessage
//       };

//       const paramOverride: { [key: string]: any } = {
//         "callId": newKey
//       }

//       let cpTool: SelectedTool | undefined = demoConfig?.callConfig?.selectedTools?.find(tool => tool.toolName === "createProfile");

//       if (cpTool) {
//         cpTool.parameterOverrides = paramOverride;
//       }
//       callConfig.selectedTools = demoConfig.callConfig.selectedTools;

//       await startCall({
//         onStatusChange: handleStatusChange,
//         onTranscriptChange: handleTranscriptChange,
//         onDebugMessage: handleDebugMessage
//       }, callConfig, showDebugMessages);

//       setIsCallActive(true);
//       handleStatusChange('Call started successfully');
//     } catch (error) {
//       handleStatusChange(`Error starting call: ${error instanceof Error ? error.message : String(error)}`);
//     }
//   };

//   const handleEndCallButtonClick = async () => {
//     try {
//       handleStatusChange('Ending call...');
//       await endCall();
//       setIsCallActive(false);

//       clearCustomerProfile();
//       setCustomerProfileKey(null);
//       handleStatusChange('Call ended successfully');
//     } catch (error) {
//       handleStatusChange(`Error ending call: ${error instanceof Error ? error.message : String(error)}`);
//     }
//   };

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <SearchParamsHandler>
//         {({ showMuteSpeakerButton, modelOverride, showDebugMessages, showUserTranscripts }: SearchParamsProps) => (
//         <div className="flex flex-col items-center justify-center min-h-screen relative">
//         <Image
//           src="/new-bg.jpg"
//           alt="Dental Clinic Background"
//           layout="fill"
//           objectFit="cover"
//           quality={100}
//           className="z-0"
//         />
//            <div className="max-w-[1206px] mx-auto w-full py-5 pl-5 pr-[10px] border border-[#2A2A2A] rounded-[3px] bg-white bg-opacity-90 z-10">
//               <div className="flex flex-col justify-center lg:flex-row">
//                 <div className="w-full lg:w-2/3">
//                   <h1 className="text-2xl font-bold w-full text-blue-800">{demoConfig.title}</h1>
//                   <div className="flex flex-col justify-between items-start h-full font-mono p-4">
//                     <div className="mt-20 self-center">
//                       <BorderedImage
//                         src={UVLogo}
//                         alt="Ultravox Logo"
//                         size="md"
//                       />
//                     </div>
//                     {isCallActive ? (
//                       <div className="w-full">
//                         <div className="mb-5 relative">
//                           <div
//                             ref={transcriptContainerRef}
//                             className="h-[300px] p-2.5 overflow-y-auto relative bg-gray-100 rounded-lg"
//                           >
//                             {callTranscript && callTranscript.map((transcript, index) => (
//                               <div key={index}>
//                                 {showUserTranscripts ? (
//                                   <>
//                                     <p><span className="text-gray-600">{transcript.speaker === 'agent' ? "Ultravox" : "User"}</span></p>
//                                     <p className="mb-4"><span>{transcript.text}</span></p>
//                                   </>
//                                 ) : (
//                                   transcript.speaker === 'agent' && (
//                                     <>
//                                       <p><span className="text-gray-600">{transcript.speaker === 'agent' ? "Ultravox" : "User"}</span></p>
//                                       <p className="mb-4"><span>{transcript.text}</span></p>
//                                     </>
//                                   )
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                           <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-t from-transparent to-white pointer-events-none" />
//                         </div>
//                         <div className="flex justify-between space-x-4 p-4 w-full">
//                           <MicToggleButton role={Role.USER}/>
//                           { showMuteSpeakerButton && <MicToggleButton role={Role.AGENT}/> }
//                           <button
//                             type="button"
//                             className="flex-grow flex items-center justify-center h-10 bg-red-500 rounded-lg"
//                             onClick={handleEndCallButtonClick}
//                             disabled={!isCallActive}
//                           >
//                             <PhoneOffIcon width={24} className="brightness-0 invert" />
//                             <span className="ml-2">End Call</span>
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div>
//                         <div className="h-[300px] text-gray-600 mb-6 mt-32 lg:mt-0">
//                           {demoConfig.overview}
//                         </div>
//                         <button
//                           type="button"
//                           className="hover:bg-blue-700 hover:text-white px-6 py-2 border-2 border-blue-500 text-blue-500 rounded-lg w-full mb-4 transition duration-300"
//                           onClick={() => handleStartCallButtonClick(modelOverride, showDebugMessages)}
//                         >
//                           Start Call
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <DebugMessages debugMessages={callDebugMessages} />
//           </div>
//         )}
//       </SearchParamsHandler>
//     </Suspense>
//   )
// }

"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import { startCall, endCall } from "@/lib/callFunctions";
import {
  CallConfig,
  CheckAvailabilityRequestDetails,
  SelectedTool,
} from "@/lib/types";
import demoConfig from "./demo-config";
import {
  Role,
  Transcript,
  UltravoxExperimentalMessageEvent,
  UltravoxSessionStatus,
} from "ultravox-client";
import BorderedImage from "@/app/components/BorderedImage";
import UVLogo from "@/public/UVMark-White.svg";
import CallStatus from "./components/CallStatus";
import DebugMessages from "@/app/components/DebugMessages";
import MicToggleButton from "./components/MicToggleButton";
import { PhoneOffIcon } from "lucide-react";
import Image from "next/image";
import { get } from "http";
import {
  BookingRequest,
  cancelBookingByUser,
  createBooking,
  getAvailability,
} from "@/lib/cal";
import { create } from "domain";
import OrderDetails from "./components/OrderDetails";

type SearchParamsProps = {
  showMuteSpeakerButton: boolean;
  modelOverride: string | undefined;
  showDebugMessages: boolean;
  showUserTranscripts: boolean;
};

type SearchParamsHandlerProps = {
  children: (props: SearchParamsProps) => React.ReactNode;
};

function SearchParamsHandler({ children }: SearchParamsHandlerProps) {
  const searchParams = useSearchParams();
  const showMuteSpeakerButton = searchParams.get("showSpeakerMute") === "true";
  const showDebugMessages = searchParams.get("showDebugMessages") === "true";
  const showUserTranscripts =
    searchParams.get("showUserTranscripts") === "true";
  let modelOverride: string | undefined;

  if (searchParams.get("model")) {
    modelOverride = "fixie-ai/" + searchParams.get("model");
  }

  return children({
    showMuteSpeakerButton,
    modelOverride,
    showDebugMessages,
    showUserTranscripts,
  });
}

export default function Home() {
  const handleOrderCompletion = async (
    userData: CheckAvailabilityRequestDetails
  ) => {
    console.log(userData);
    // const availabilityResponse = await getAvailability();
    // const bookingRequest: BookingRequest = {
    //   start: "2025-03-14T09:00:00Z",
    //   eventTypeId: 1907802,
    //   attendee: {
    //     name: "Pritm ROy",
    //     email: "john.doe@example.com",
    //     timeZone: "America/New_York",
    //     phoneNumber: "+919876543210",
    //     language: "it",
    //   },
    //   guests: ["guest1@example.com", "guest2@example.com"],
    //   meetingUrl: "https://example.com/meeting",
    //   location: "https://example.com/meeting",
    //   metadata: { key: "value" },
    //   bookingFieldsResponses: { customField: "customValue" },
    // };

      const bookingRequest: BookingRequest = {
        ...userData,
        eventTypeId: 1907802,
        start: userData.start, // Example start time
        attendee: {
          name: userData.name,
          email: userData.email,
          timeZone: userData.start, // Example time zone
          phoneNumber: userData.phoneNumber,
          language: "en", // Example language
        },
      };
      const createBookingResponse = await createBooking(bookingRequest);

    
  };
  const [isCallActive, setIsCallActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string>("off");
  const [callTranscript, setCallTranscript] = useState<Transcript[] | null>([]);
  const [callDebugMessages, setCallDebugMessages] = useState<
    UltravoxExperimentalMessageEvent[]
  >([]);
  const [customerProfileKey, setCustomerProfileKey] = useState<string | null>(
    null
  );
const [isLoading, setIsLoading] = useState(false);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    const handleAvailability = async () => {
      const availabilityResponse = await getAvailability();
      console.log("Availability Response", availabilityResponse);
    }
    
    window.addEventListener(
      "fetchAvailability",
      handleAvailability as EventListener
    );
    return () => {
      window.removeEventListener(
        "fetchAvailability",
        handleAvailability as EventListener
      );
    };
  }, []);


  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop =
        transcriptContainerRef.current.scrollHeight;
    }
  }, [callTranscript]);

  const handleStatusChange = useCallback(
    (status: UltravoxSessionStatus | string | undefined) => {
      if (status) {
        setAgentStatus(status);
      } else {
        setAgentStatus("off");
      }
    },
    []
  );

  const handleTranscriptChange = useCallback(
    (transcripts: Transcript[] | undefined) => {
      if (transcripts) {
        setCallTranscript([...transcripts]);
      }
    },
    []
  );

  const handleDebugMessage = useCallback(
    (debugMessage: UltravoxExperimentalMessageEvent) => {
      setCallDebugMessages((prevMessages) => [...prevMessages, debugMessage]);
    },
    []
  );

  const clearCustomerProfile = useCallback(() => {
    setCustomerProfileKey((prev) => (prev ? `${prev}-cleared` : "cleared"));
  }, []);

  const handleStartCallButtonClick = async (
    modelOverride?: string,
    showDebugMessages?: boolean
  ) => {
    try {
      setIsLoading(true); // Show loader
      handleStatusChange("Starting call...");
      setCallTranscript(null);
      setCallDebugMessages([]);
      clearCustomerProfile();

      const newKey = `call-${Date.now()}`;
      setCustomerProfileKey(newKey);

      let callConfig: CallConfig = {
        systemPrompt: demoConfig.callConfig.systemPrompt,
        model: modelOverride || demoConfig.callConfig.model,
        languageHint: demoConfig.callConfig.languageHint,
        voice: demoConfig.callConfig.voice,
        temperature: demoConfig.callConfig.temperature,
        maxDuration: demoConfig.callConfig.maxDuration,
        timeExceededMessage: demoConfig.callConfig.timeExceededMessage,
      };

      const paramOverride: { [key: string]: any } = {
        callId: newKey,
      };

      let cpTool: SelectedTool | undefined =
        demoConfig?.callConfig?.selectedTools?.find(
          (tool) => tool.toolName === "createProfile"
        );

      if (cpTool) {
        cpTool.parameterOverrides = paramOverride;
      }
      callConfig.selectedTools = demoConfig.callConfig.selectedTools;

      // const cancleBookingResponse = await cancelBooking("vZa9yVjhKG7KTxNZTZ8GuM");
      // const cancleBookingResponse= cancelBooking("6105204", "Schedule conflict");

      // const cancleBookingResponse = await cancelBookingByUser(
      //   "Sayan Kundu",
      //   "dissubha.info@gmail.com",
      //   "Schedule COnflict"
      // );

      await startCall(
        {
          onStatusChange: handleStatusChange,
          onTranscriptChange: handleTranscriptChange,
          onDebugMessage: handleDebugMessage,
        },
        callConfig,
        showDebugMessages
      );

      setIsCallActive(true);
      handleStatusChange("Call started successfully");
    } catch (error) {
      handleStatusChange(
        `Error starting call: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const handleEndCallButtonClick = async () => {
    try {
      handleStatusChange("Ending call...");
      await endCall();
      setIsCallActive(false);

      clearCustomerProfile();
      setCustomerProfileKey(null);
      handleStatusChange("Call ended successfully");
    } catch (error) {
      handleStatusChange(
        `Error ending call: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsHandler>
        {({
          showMuteSpeakerButton,
          modelOverride,
          showDebugMessages,
          showUserTranscripts,
        }: SearchParamsProps) => (
          <div className="flex flex-col items-center justify-center min-h-screen relative">
            <Image
              src="/new-bg.jpg"
              alt="Dental Clinic Background"
              fill
              className="z-0 object-cover"
            />
            <div className="max-w-[1206px] mx-auto w-full py-5 pl-5 pr-[10px] border border-[#2A2A2A] rounded-[3px] bg-white bg-opacity-90 z-10">
              <div className="flex flex-col justify-center lg:flex-row">
                <div className="w-full lg:w-2/3">
                  <h1 className="text-2xl font-bold w-full text-blue-800">
                    {demoConfig.title}
                  </h1>
                  <div className="flex flex-col justify-between items-start h-full font-mono p-4">
                    <div className="mt-20 self-center">
                      <BorderedImage
                        src={UVLogo}
                        alt="Ultravox Logo"
                        size="md"
                      />
                    </div>
                    {isCallActive ? (
                      <div className="w-full">
                        <div className="mb-5 relative">
                          <div
                            ref={transcriptContainerRef}
                            className="h-[300px] p-2.5 overflow-y-auto relative bg-gray-100 rounded-lg backdrop-blur-sm bg-opacity-50"
                          >
                            {callTranscript &&
                              callTranscript.map((transcript, index) => (
                                <div key={index}>
                                  {showUserTranscripts ? (
                                    <>
                                      <p>
                                        <span className="text-gray-600">
                                          {transcript.speaker === "agent"
                                            ? "Ultravox"
                                            : "User"}
                                        </span>
                                      </p>
                                      <p className="mb-4">
                                        <span>{transcript.text}</span>
                                      </p>
                                    </>
                                  ) : (
                                    transcript.speaker === "agent" && (
                                      <>
                                        <p>
                                          <span className="text-gray-600">
                                            {transcript.speaker === "agent"
                                              ? "Ultravox"
                                              : "User"}
                                          </span>
                                        </p>
                                        <p className="mb-4">
                                          <span>{transcript.text}</span>
                                        </p>
                                      </>
                                    )
                                  )}
                                </div>
                              ))}
                          </div>
                          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-t from-transparent to-white pointer-events-none" />
                        </div>
                        <div className="flex justify-between space-x-4 p-4 w-full">
                          <MicToggleButton role={Role.USER} />
                          {showMuteSpeakerButton && (
                            <MicToggleButton role={Role.AGENT} />
                          )}
                          <button
                            type="button"
                            className="flex-grow flex items-center justify-center h-10 bg-red-500 rounded-lg"
                            onClick={handleEndCallButtonClick}
                            disabled={!isCallActive}
                          >
                            <PhoneOffIcon
                              width={24}
                              className="brightness-0 invert"
                            />
                            <span className="ml-2 text-white">End Call</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="h-[300px] text-gray-600 mb-6 mt-32 lg:mt-0">
                          {demoConfig.overview}
                        </div>
                        <button
                          type="button"
                          className="hover:bg-blue-700 hover:text-white px-6 py-2 border-2 border-blue-500 text-blue-500 rounded-lg w-full mb-4 transition duration-300"
                          onClick={() =>
                            handleStartCallButtonClick(
                              modelOverride,
                              showDebugMessages
                            )
                          }
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          ) : (
                            "Start Call"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <OrderDetails orderCompletion={handleOrderCompletion} />
                </div>
              </div>
            </div>
            <DebugMessages debugMessages={callDebugMessages} />
          </div>
        )}
      </SearchParamsHandler>
    </Suspense>
  );
}
