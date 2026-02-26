import { Send, MapPin } from 'lucide-react';
import { ChatDemo } from '../types/blueprint';

interface ChatMockupProps {
  chatDemo: ChatDemo;
}

export default function ChatMockup({ chatDemo }: ChatMockupProps) {
  return (
    <div className="mt-5 flex justify-center">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-card overflow-hidden flex flex-col" style={{ maxHeight: '420px' }}>
        {/* Listing context header */}
        <div className="bg-muted/60 border-b border-border px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className={`w-12 h-12 rounded-xl ${chatDemo.listingContext.colorPlaceholder} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <h4 className="font-heading font-bold text-sm text-foreground truncate">{chatDemo.listingContext.title}</h4>
            <p className="text-primary font-heading font-black text-sm">D {chatDemo.listingContext.price.toLocaleString()}</p>
          </div>
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatDemo.sampleMessages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'seller' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm font-body leading-relaxed ${
                  msg.role === 'seller'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-xs text-muted-foreground mt-0.5 px-1">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="border-t border-border px-3 py-2.5 flex items-center gap-2 flex-shrink-0 bg-card">
          <div className="flex-1 bg-muted/50 rounded-xl px-3 py-2 text-sm font-body text-muted-foreground">
            {chatDemo.inputPlaceholder}
          </div>
          <button className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
