"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2, Copy, Download } from "lucide-react";
import { Agent } from "@prisma/client";

interface ChatInterfaceProps {
  agents: Agent[];
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  agentName?: string;
  timestamp: Date;
  jobId?: string;
}

export function ChatInterface({ agents }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(
    agents[0] || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedAgent || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          agentId: selectedAgent.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Poll for job completion
        const jobId = result.data.id;
        pollJobStatus(jobId, selectedAgent.name);
      } else {
        throw new Error(result.error || "Failed to create job");
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: `Error: ${
          error instanceof Error ? error.message : "Something went wrong"
        }`,
        agentName: selectedAgent.name,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const pollJobStatus = async (jobId: string, agentName: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        const job = await response.json();

        if (job.status === "COMPLETED") {
          const assistantMessage: Message = {
            id: jobId,
            type: "assistant",
            content: job.output,
            agentName,
            timestamp: new Date(),
            jobId,
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setIsLoading(false);
        } else if (job.status === "FAILED") {
          const errorMessage: Message = {
            id: jobId,
            type: "assistant",
            content: "Sorry, there was an error processing your request.",
            agentName,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          setIsLoading(false);
        } else {
          // Continue polling
          setTimeout(poll, 2000);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    poll();
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm h-[600px] flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">AI Agent Chat</h2>
          <select
            value={selectedAgent?.id || ""}
            onChange={(e) => {
              const agent = agents.find((a) => a.id === e.target.value);
              setSelectedAgent(agent || null);
            }}
            className="px-3 py-2 border rounded-lg text-sm bg-white"
          >
            <option value="">Select Agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Ready to assist you
            </h3>
            <p className="text-slate-600">
              Choose an agent and start a conversation
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "assistant" && (
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-brand-600" />
              </div>
            )}

            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === "user"
                  ? "bg-brand-500 text-white"
                  : "bg-slate-100 text-slate-900"
              }`}
            >
              {message.type === "assistant" && message.agentName && (
                <p className="text-xs font-medium mb-1 text-brand-600">
                  {message.agentName}
                </p>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
                {message.type === "assistant" && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="p-1 hover:bg-slate-200 rounded"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button className="p-1 hover:bg-slate-200 rounded">
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {message.type === "user" && (
              <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-brand-600" />
            </div>
            <div className="bg-slate-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                <span className="text-sm text-slate-600">
                  {selectedAgent?.name} is thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${selectedAgent?.name || "AI Agent"}...`}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            disabled={!selectedAgent || isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || !selectedAgent || isLoading}
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-slate-500 mt-2">
          Each message costs 1 credit.{" "}
          {selectedAgent
            ? `Using ${selectedAgent.name}`
            : "Select an agent first"}
        </p>
      </div>
    </div>
  );
}
