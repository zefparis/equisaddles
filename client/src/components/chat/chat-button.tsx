import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "../../hooks/use-language";

interface ChatButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

export default function ChatButton({ onClick, hasUnread = false }: ChatButtonProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={onClick}
        className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white border-2 border-white"
        size="lg"
      >
        <div className="relative">
          <MessageCircle className="h-6 w-6 text-white" />
          {hasUnread && (
            <Badge className="absolute -top-2 -right-2 w-3 h-3 p-0 bg-red-500 border-2 border-white">
              <span className="sr-only">{t("chat.unread")}</span>
            </Badge>
          )}
        </div>
      </Button>
    </div>
  );
}