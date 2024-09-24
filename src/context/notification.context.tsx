"use client";

import { MessageSelect } from "@/drizzle/schema";
import { pusherClient } from "@/lib/pusher/client";
import { ConversationListItemType, ConversationListType } from "@/lib/requests/conversation.request";
import { getUnreadMessagesByUserId } from "@/lib/requests/message.request";
import { getWaitingTransactions } from "@/lib/requests/transaction.request";
import { useSession } from "next-auth/react";
import { usePathname, useRouter} from "next/navigation";
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
  deleteConversationFromState: (convoID: string) => void;
  newTransaction: string[];
}

const NotificationContext = createContext<INotifContext>({} as INotifContext);

interface IProps {
  children: React.ReactNode;
}
export const NotificationProvider: FC<IProps> = ({ children }) => {
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const notif = true;

  const [userId, setUserId] = useState<string>();
  const [conversations, setConversations] = useState<
    ConversationListItemType[]
  >([]);
  const [selectedConvo, setSelectedConvo] =
    useState<ConversationListItemType>();
  const [messages, setMessages] = useState<MessageSelect[]>([]);
  const [newMessage, setNewMessage] = useState<string[]>([]);
  const [newTransaction, setNewTransaction] = useState<string[]>([]);

  const selectedConvoRef = useRef(selectedConvo);
  const conversationsRef = useRef(conversations);
  const pathnameRef = useRef(pathname);
  const messagesRef = useRef(messages);

  //ON MET A JOUR LES REFS A CHAQUE RENDU
  useEffect(() => {
    selectedConvoRef.current = selectedConvo;
    conversationsRef.current = conversations;
    pathnameRef.current = pathname;
    messagesRef.current = messages;
  }, [selectedConvo, conversations, pathname, messages]);

  useEffect(() => {
    console.log('USEEFFECT POUR SORT LES CONVERSATIONS');
    sortConversationByLastMessageDate();
  },[ messages, newMessage])

  //ON RECUPERE L'ID DE USER DANS UN STATE POUR L'UTILISER PLUS FACILEMENT
  useEffect(() => {
    if (session?.data?.user?.id) {
      setUserId(session?.data?.user?.id);
    }
  }, [session.data?.user?.id]);

  //ON FETCH L'ID DE MESSAGES NON LUS
  useEffect(() => {

    if (!userId ) {
      return;
    }

    const getUnreadMsg = async (userId: string) => {
      const res = await getUnreadMessagesByUserId(userId);
      if (res) {
        const mappedRes =
          res
            .filter((item) => item.id !== null)
            .map((item) => item.id as string) || [];
        setNewMessage(mappedRes);
      }
    };
    getUnreadMsg(userId);
  }, [userId]);

  //FETCH DES TRANSACTIONS EN ATTENTE
  useEffect(() => {
    if (!userId) {
      return;
    }
    const waitinTrans = async () => {
      const res = await getWaitingTransactions(userId);
      if (res) {
        const mapped = res.map(item => item.id);
        setNewTransaction(mapped)
      }
    }
    waitinTrans();
  }, [userId])
  
  const sortConversationByLastMessageDate = () => {
    const sorted = [...conversationsRef.current].sort((a, b) => {
      // Si une conversation n'a pas de messages et l'autre en a, 
      // celle sans messages vient en premier
      if (a.messages.length === 0 && b.messages.length > 0) {
        return -1;
      }
      if (b.messages.length === 0 && a.messages.length > 0) {
        return 1;
      }
  
      // Si les deux conversations n'ont pas de messages, 
      // on les trie par date de création (la plus récente en premier)
      if (a.messages.length === 0 && b.messages.length === 0) {
        return (b.createdAt?.valueOf() || 0) - (a.createdAt?.valueOf() || 0);
      }
  
      // Si les deux conversations ont des messages, 
      // on les trie par date du dernier message (le plus récent en premier)
      const lastMessageA = a.messages[a.messages.length - 1];
      const lastMessageB = b.messages[b.messages.length - 1];
      return (lastMessageB.createdAt?.valueOf() || 0) - (lastMessageA.createdAt?.valueOf() || 0);
    });
  
    setConversations(sorted);
  };

  const handleIncomingMessage = (msg: MessageSelect) => {

    //ON CHECK SI L'USER EST SUR LA PAGE DES CONVO ET QUE LA SELECTEDCONVO CORRESPOND AU MESSAGE ENTRANT
    if (selectedConvoRef.current?.id === msg.conversationId && pathnameRef.current.startsWith('/messages') ) {
      //SI LA SELECTEDCONVO.ID === NEWMESSAGE.CONVOID, ALORS ON L'AJOUTE AU MESSAGE
      console.log('ON ANRETRE DANS LE IF');
      return addNewMessage(msg);
    }

    //SINON ON AJOUTE L'ID DU MESSAGE A NEWMESSAGES POUR LA NAVBAR
    setNewMessage((previous) => [...previous, msg.id]);

    //ET ON UPDATE LE DERNIER MESSAGE DE LA CONVERSATION A LAQQUELLE LE MESSAGE APPARTIENT
    const newConvos = conversationsRef.current.map((convo) => {
      if (convo.id === msg.conversationId) {
        const newC = { ...convo, messages: [msg] };
        return newC;
      }
      return convo;
    });
    console.log('NEW CONVOS : ', newConvos);
    setConversations(newConvos);
  };

  ///////////////////////////////
  //  GESTION DES NOTIFICATION //
  ///////////////////////////////
  useEffect(() => {
    if (!userId || !notif) {
      console.log('pas de notif');
      return;
    }
    pusherClient.subscribe(userId);

    //INCOMING MESSAGE
    pusherClient.bind("new_message", (msg: MessageSelect) => {
      console.log("ON RENTRE DANS LE BIND NEW_MESSAGE");
      const mappedMsg: MessageSelect = {
        ...msg,
        createdAt: new Date(msg.createdAt!),
      };
      handleIncomingMessage(mappedMsg);
    });

    //DELETED CONVERSATION
    pusherClient.bind('delete_conversation', (convoId: string) => {
      console.log('DELETE CONVERSATION PUSHER : ', convoId);
      deleteConversationFromState(convoId);
    })

    //CREATION CONVERSATION
    pusherClient.bind('create_conversation', (convo: ConversationListItemType) => {
      const mappedMsg: MessageSelect = {...convo.messages[0], createdAt: new Date(convo.messages[0].createdAt as Date) }
      setConversations([...conversationsRef.current, { ...convo, messages: [mappedMsg] }]);
      setNewMessage(previous => [...previous, convo.messages[0].id]);
    })

    //NEW TRANSACTION
    pusherClient.bind('transaction_creation', (transactionId: string) => {
      setNewTransaction(previous => [...previous, transactionId]);
    })

    //ON UNBSUBSCRIBE AU DEMONTAGE
    return () => {
      console.log("ON UNSUBSRIBE");
      pusherClient.unbind();
    };
  }, [userId]);

  //AJOUTER LE DERNIER MESSAGE AUX AUTRES
  const addNewMessage = (newMsg: MessageSelect) => {
    setMessages([...messagesRef.current, newMsg]);

    //ON MET A JOUR CONVERSATIONS POUR METTRE A JOUR LA DATE DU DERNIER MESSAGE
    const updatedConvos = conversationsRef.current.map(convo => {
      if (convo.id !== newMsg.conversationId) {
        return convo;
      }
      const newC: typeof convo = { ...convo, messages: [{...newMsg, isRead: true }] };
      return newC
    })
    setConversations(updatedConvos);
  };

  //SUPPRESSION D'UNE CONVERSATION
  const deleteConversationFromState = (convoId: string) => {
    const filteredConvo = conversationsRef.current.filter(convo => convo.id !== convoId);
    setConversations(filteredConvo);
    if (selectedConvoRef.current?.id === convoId) {
      setSelectedConvo(undefined);
    }
  }

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
    deleteConversationFromState,
    newTransaction
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
