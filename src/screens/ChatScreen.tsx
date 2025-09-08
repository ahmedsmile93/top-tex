import { useState, useEffect, useLayoutEffect } from "react";
import { useRef } from "react";

import { FaPaperPlane } from "react-icons/fa";
import LogoUploadCard from "../components/LogoUploadCard";
import ProductGrid from "../components/ProductGrid";
import CustomizationGrid from "../components/CustomizationGrid";
import VoiceInput from "../components/VoiceInput";
import type { ChatEntry, ApiResponse, ChatRequestPayload } from "../types";

const API_URL = import.meta.env.VITE_API_URL;
const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID;

export function ChatScreen() {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null); // <- NEW (scroll container)
  const footerRef = useRef<HTMLDivElement | null>(null); // <- NEW (fixed input bar)

  const [question, setQuestion] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);

  const addUserMessageToHistory = (msg: string, hideUserMessage = false) => {
    setChatHistory((prev) => [
      ...prev,
      {
        question: msg,
        answer: "",
        products: [],
        hidden: hideUserMessage,
      },
    ]);
    if (!hideUserMessage) setQuestion("");
  };

  const updateChatEntryWithResponse = (data: ApiResponse, idx: number) => {
    setSessionId(data.session_id);
    if (data.title) setTitle(data.title);

    setChatHistory((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        answer: data.answer,
        products: data.products || [],
        customizations: data.customizations || [],
        showUploadLogo: !!data.show_upload_placeholder,
      };
      return updated;
    });
  };

  const handleApiError = (idx: number) => {
    setChatHistory((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        answer: "Error contacting API.",
        products: [],
      };
      return updated;
    });
  };

  const handleSubmit = async (msg?: string, hideUserMessage = false) => {
    const currentQuestion = msg || question;
    if (!currentQuestion.trim()) return;

    // Add user message
    addUserMessageToHistory(currentQuestion, hideUserMessage);
    const idx = chatHistory.length;

    setLoading(true);
    try {
      const payload: ChatRequestPayload = {
        user_id: DEFAULT_USER_ID,
        message: currentQuestion,
        ...(sessionId && { session_id: sessionId }),
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse = await res.json();
      updateChatEntryWithResponse(data, idx);
    } catch (err) {
      console.error("API Error:", err);
      handleApiError(idx);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    const sc = scrollRef.current;
    if (!sc) return;
    requestAnimationFrame(() => {
      sc.scrollTop = sc.scrollHeight;
    });
  };

  const syncBottomPadding = () => {
    const sc = scrollRef.current;
    const footer = footerRef.current;
    if (!sc || !footer) return;
    sc.style.paddingBottom = `${footer.offsetHeight + 16}px`;
  };

  useLayoutEffect(() => {
    syncBottomPadding();
    const onResize = () => syncBottomPadding();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    syncBottomPadding();
    scrollToBottom();
  }, [chatHistory, loading]);

  useEffect(() => {
    if (!loading && inputRef.current) inputRef.current.focus();
  }, [loading]);

  return (
    <main className="w-full h-full flex flex-col font-sans text-gray-800">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8">
        <div className="w-[1200px] mx-auto">
          <h2 className="text-center text-3xl font-bold mb-12 mt-8">
            {title || "Comment puis-je vous aider ?"}
          </h2>

          <div className="flex flex-col gap-6 mb-24">
            {chatHistory.map((chat, idx) => (
              <div key={idx} className="mb-8 w-full flex flex-col gap-3">
                {/* Question */}
                {!chat.hidden && (
                  <div className="flex justify-end max-w-[70%] ml-auto">
                    <div className="bg-green-300 text-black-800 px-6 py-4 rounded-2xl rounded-br-sm text-base leading-snug font-normal">
                      {chat.question}
                    </div>
                  </div>
                )}

                <div className="flex justify-start max-w-[70%] mr-auto">
                  <div
                    className={`bg-gray-200 text-gray-900 px-6 py-4 rounded-2xl rounded-bl-sm text-base leading-snug font-normal ${"w-auto"}`}
                  >
                    {loading &&
                    idx === chatHistory.length - 1 &&
                    !chat.answer ? (
                      <div className="flex justify-center items-center h-6">
                        <div className="w-6 h-6 border-4 border-gray-300 border-t-orange-800 rounded-full animate-spin" />
                      </div>
                    ) : (
                      <>
                        {chat.answer?.split("\n").map((line, i) => (
                          <p key={i} className="mb-4">
                            {line}
                          </p>
                        ))}

                        {chat.products?.length > 0 && (
                          <ProductGrid
                            products={[...chat.products].sort((a, b) => {
                              if (a.family === "bag" && b.family === "bag") {
                                const order = [
                                  "OPEN",
                                  "CLOSED",
                                  "Professional",
                                ];
                                return (
                                  order.indexOf(a.brand) -
                                  order.indexOf(b.brand)
                                );
                              }
                              return 0; // keep order unchanged for other families
                            })}
                            selectedCode={chat.selectedProductId || null}
                            isLocked={chat.isSelectionLocked || false}
                            selectedFamily={chat.selectedFamily || null}
                            onSelect={(id) => {
                              const selectedProduct = chat.products.find(
                                (p) => p.id === id
                              );
                              if (!selectedProduct) return;

                              setChatHistory((prev) => {
                                const updated = [...prev];
                                updated[idx] = {
                                  ...updated[idx],
                                  selectedProductId: id,
                                  selectedFamily: selectedProduct.family,
                                  isSelectionLocked: true,
                                };
                                return updated;
                              });
                              handleSubmit(id, true);
                            }}
                          />
                        )}

                        {(chat.customizations ?? []).length > 0 && (
                          <CustomizationGrid
                            customizations={chat.customizations || []}
                            selectedId={chat.selectedCustomizationId || null}
                            onSelect={(id: string) => {
                              setChatHistory((prev) => {
                                const updated = [...prev];
                                updated[idx] = {
                                  ...updated[idx],
                                  selectedCustomizationId: id,
                                };
                                return updated;
                              });
                              handleSubmit(id, true);
                            }}
                          />
                        )}

                        {chat.showUploadLogo && (
                          <LogoUploadCard
                            onUpload={() => {
                              setChatHistory((prev) => {
                                const updated = [...prev];
                                updated[idx] = {
                                  ...updated[idx],
                                  showUploadLogo: true,
                                };
                                return updated;
                              });
                              handleSubmit("logo_uploaded", true);
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Fixed input at bottom */}
      <div
        ref={footerRef}
        className="fixed bottom-12 left-1/2 transform -translate-x-1/2 w-[700px] max-w-full bg-gray-200 rounded-2xl px-8 py-2.5 flex items-center gap-4 z-10"
      >
        <VoiceInput
          onTranscript={(text) =>
            setQuestion((prev) => (prev ? prev + " " + text : text))
          }
        />
        <FaPaperPlane
          className={`text-orange-800 text-xl cursor-pointer transition-colors ${
            loading
              ? "cursor-not-allowed text-gray-400"
              : "hover:text-orange-900"
          }`}
          onClick={!loading ? () => handleSubmit() : undefined}
          title="Send"
        />
        <input
          type="text"
          ref={inputRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) handleSubmit();
          }}
          placeholder="Tapez un message"
          className="flex-1 px-4 py-2 rounded-2xl border border-gray-300 text-base text-gray-900 outline-offset-2 placeholder-gray-500 bg-white"
          disabled={loading}
        />
      </div>
    </main>
  );
}
