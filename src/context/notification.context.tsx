"use client";

import { MessageSelect } from "@/drizzle/schema";
import { pusherClient } from "@/lib/pusher/client";
import { ConversationListItemType } from "@/lib/requests/conversation.request";
import { getUnreadMessagesByUserId } from "@/lib/requests/message.request";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  createContext,
  Dispatch,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface INotifContext {
  conversations: ConversationListItemType[];
  setConversations: Dispatch<ConversationListItemType[]>;
  selectedConvo: ConversationListItemType | undefined;
  setSelectedConvo: Dispatch<ConversationListItemType | undefined>;
  messages: MessageSelect[];
  setMessages: Dispatch<MessageSelect[]>;
  newMessage: string[];
  setNewMessage: Dispatch<React.SetStateAction<string[]>>;
  addNewMessage: (msg: MessageSelect) => void;
}

const NotificationContext = createContext<INotifContext>({} as INotifContext);

interface IProps {
  children: React.ReactNode;
}
export const NotificationProvider: FC<IProps> = ({ children }) => {
  const session = useSession();
  const pathname = usePathname();

  const [userId, setUserId] = useState<string>();
  const [conversations, setConversations] = useState<
    ConversationListItemType[]
  >([]);
  const [selectedConvo, setSelectedConvo] =
    useState<ConversationListItemType>();
  const [messages, setMessages] = useState<MessageSelect[]>([]);
  const [newMessage, setNewMessage] = useState<string[]>([]);

  const selectedConvoRef = useRef(selectedConvo);
  const conversationsRef = useRef(conversations);
  const pathnameRef = useRef(pathname);

  //ON MET A JOUR LES REFS A CHAQUE RENDU
  useEffect(() => {
    selectedConvoRef.current = selectedConvo;
    conversationsRef.current = conversations;
    pathnameRef.current = pathname;
  }, [selectedConvo, conversations, pathname]);

  //ON RECUPERE L'ID DE USER DANS UN STATE POUR L'UTILISER PLUS FACILEMENT
  useEffect(() => {
    if (session?.data?.user?.id) {
      setUserId(session?.data?.user?.id);
    }
  }, [session.data?.user?.id]);

  //ON FETCH L'ID DE MESSAGES NON LUS
  useEffect(() => {
    if (!userId) {
      return;
    }

    const getUnreadMsg = async (userId: string) => {
      const res = await getUnreadMessagesByUserId(userId);
      if (res) {
        const mappedRes = res.filter(item => item.id !== null).map(item => item.id as string) || [];
        setNewMessage(mappedRes);
      }
    };
    getUnreadMsg(userId);
  }, [userId]);

  const handleIncomingMessage = (msg: MessageSelect) => {
    console.log("HANDLE INCOMING MESSAGE");
    //ON CHECK SI LUSER EST DANS LA PAGE /MESSAGE
    if (pathnameRef.current !== "/messages") {
      console.log("PATHNAME DIFFERENT, ON SETNEWMESSAGE : ",pathnameRef.current);
      //SI IL N'Y EST PAS, ON AJOUTE 1 A NEWMESSAGE
      return setNewMessage((previous) => [...previous, msg.id]);
    }

    //SINON, ON CHECK LA SELECTEDCONVO
    if (selectedConvoRef.current?.id === msg.conversationId) {
      console.log("CONVOID IDENTIQUE, ON AJOUTE LE MESSAGE");
      //SI LA SELECTEDCONVO.ID === NEWMESSAGE.CONVOID, ALORS ON L'AJOUTE AU MESSAGE
      return addNewMessage(msg);
    }

    //SINON ON UPDATE LE DERNIER MESSAGE DE LA CONVO DANS CONVERSATIONS,
    //CA PERMETTRA DE DISPLAY L'ICONE DE NOTIF ET DE METTRE A JOUR L'HEURE DU DERNIER MESSAGE
    if (conversationsRef.current.length > 0) {
      const newConvos = conversationsRef.current.map((convo) => {
        if (convo.id === msg.conversationId) {
          const newC = { ...convo, messages: [msg] };
          return newC;
        }
        return convo;
      });
      console.log(
        "CONVERSATION DIFFERENTE, ON UPDATE CONVERSATIONS",
        newConvos
      );
      return setConversations((prev) => newConvos);
    }
    console.log(
      "AUCUNE CONDITION FAVORABLE : ",
      pathnameRef.current,
      selectedConvoRef.current?.id,
      conversationsRef.current?.length
    );
  };

  //RECEPTION DES NOUVEAUX MESSAGES VIA PUSHER
  useEffect(() => {
    if (!userId) {
      return;
    }
    pusherClient.subscribe(userId);
    pusherClient.bind("new_message", (msg: MessageSelect) => {
      console.log("ON RENTRE DANS LE BIND NEW_MESSAGE");
      const mappedMsg: MessageSelect = {...msg, createdAt: new Date(msg.createdAt!)} 
      handleIncomingMessage(mappedMsg);
    });
    return () => {
      console.log("ON UNSUBSRIBE");
      pusherClient.unbind();
    };
  }, [userId]);

  //AJOUTER LE DERNIER MESSAGE AUX AUTRES
  const addNewMessage = (newMsg: MessageSelect) => {
    setMessages((prev) => [...prev, newMsg]);
  };

  const value = {
    conversations,
    setConversations,
    selectedConvo,
    setSelectedConvo,
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    addNewMessage,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
