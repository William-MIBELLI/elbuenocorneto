"use client";

import { MessageSelect } from "@/drizzle/schema";
import { pusherClient } from "@/lib/pusher/client";
import {
  ConversationListItemType,
  ConversationListType,
  getConversationMessages,
} from "@/lib/requests/conversation.request";
import { getUnreadMessagesByUserId } from "@/lib/requests/message.request";
import { getWaitingTransactions } from "@/lib/requests/transaction.request";
import {
  initialState,
  notificationReducer,
} from "@/reducer/notification.reducer";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  FC,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

// interface INotifContext {
//   conversations: ConversationListItemType[];
//   setConversations: Dispatch<ConversationListItemType[]>;
//   selectedConvo: ConversationListItemType | undefined;
//   setSelectedConvo: Dispatch<ConversationListItemType | undefined>;
//   messages: MessageSelect[];
//   setMessages: Dispatch<MessageSelect[]>;
//   newMessage: string[];
//   setNewMessage: Dispatch<React.SetStateAction<string[]>>;
//   addNewMessage: (msg: MessageSelect) => void;
//   deleteConversationFromState: (convoID: string) => void;
//   newTransaction: string[];
// }

const useNotificationContextValue = () => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const {
    messages,
    newMessage,
    conversations,
    userId,
    selectedConvo,
    newTransaction,
  } = state;
  const session = useSession();
  const pathname = usePathname();
  const notif = true;

  ///////////////////////
  //////  USEEFFECT
  ///////////////////////

  //ON RECUPERE L'ID DE USER
  useEffect(() => {
    if (session?.data?.user?.id) {
      const userId = session?.data?.user?.id;
      dispatch({ type: "UPDATE_USER_ID", payload: userId });
    }
  }, [session.data?.user?.id]);

  //ON TRI LES CONVERSATIONS SELON LA DATE DU DERNIER MESSAGE
  useEffect(() => {
    sortConversationByLastMessageDate();
  }, [newMessage]);

  //FETCH DES TRANSACTIONS EN ATTENTE
  useEffect(() => {
    if (!userId) {
      return;
    }
    const waitinTrans = async () => {
      const res = await getWaitingTransactions(userId);
      if (res) {
        const mapped = res.map((item) => item.id);
        dispatch({ type: "NEW_TRANSACTION_PUSHER", payload: mapped });
      }
    };
    waitinTrans();
  }, [userId]);

  //ON FETCH L'ID DE MESSAGES NON LUS
  useEffect(() => {
    if (!userId) {
      return;
    }

    const getUnreadMsg = async (userId: string) => {
      const res = await getUnreadMessagesByUserId(userId);
      if (res) {
        const mappedRes =
          res
            .filter((item) => item.id !== null)
            .map((item) => item.id as string) || [];
        dispatch({ type: "UPDATE_MESSAGE_PUSHER", payload: mappedRes });
      }
    };
    getUnreadMsg(userId);
  }, [userId]);

  /////////////////////////////////////////////////////////////////////////////////////////////////
  //  FONCTION       //////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  //FONCTION POUR TRIER LES CONVERSATIONS
  const sortConversationByLastMessageDate = useCallback(() => {
    console.log('SORT CONVERSATION : ', conversations);
    if (conversations.length <= 1) {
      return;
    }
    const sorted = [...conversations].sort((a, b) => {
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
      return (
        (lastMessageB.createdAt?.valueOf() || 0) -
        (lastMessageA.createdAt?.valueOf() || 0)
      );
    });

    dispatch({ type: "UPDATE_CONVERSATIONS", payload: sorted });
  }, [conversations]);

  const handleIncomingMessage = (msg: MessageSelect) => {
    //ON CHECK SI L'USER EST SUR LA PAGE DES CONVO ET QUE LA SELECTEDCONVO CORRESPOND AU MESSAGE ENTRANT
    console.log("HANDLE INCOIMING MESSAGE : ", msg, selectedConvo);
    if (
      selectedConvo?.id === msg.conversationId &&
      pathname.startsWith("/messages")
    ) {
      //SI LA SELECTEDCONVO.ID === NEWMESSAGE.CONVOID, ALORS ON L'AJOUTE AU MESSAGE
      return addNewMessage(msg);
    }

    //SINON ON AJOUTE L'ID DU MESSAGE A NEWMESSAGES POUR LA NAVBAR
    //ET ON UPDATE LE DERNIER MESSAGE DE LA CONVERSATION A LAQQUELLE LE MESSAGE APPARTIENT
    const newConvos = conversations.map((convo) => {
      if (convo.id === msg.conversationId) {
        const newC = { ...convo, messages: [msg] };
        return newC;
      }
      return convo;
    });
    dispatch({
      type: "HANDLE_INCOMING_MESSAGE",
      payload: {
        newMessage: [...newMessage, msg.id],
        conversations: newConvos,
      },
    });
  };

  //AJOUTER LE DERNIER MESSAGE AUX AUTRES ET METTRE A JOUR LA CONVERSATION
  const addNewMessage = (newMsg: MessageSelect) => {
    console.log("ADD NEW MESSAGE : ", conversations.length);
    //ON MET A JOUR CONVERSATIONS POUR METTRE A JOUR LA DATE DU DERNIER MESSAGE
    const updatedConvos = conversations.map((convo) => {
      if (convo.id !== newMsg.conversationId) {
        return convo;
      }
      const newC: typeof convo = {
        ...convo,
        messages: [{ ...newMsg, isRead: true }],
      };
      return newC;
    });
    dispatch({
      type: "UPDATE_MESSAGES",
      payload: {
        conversations: updatedConvos,
        messages: [...messages, newMsg],
      },
    });
  };

  //SUPPRESSION D'UNE CONVERSATION
  const deleteConversation = (convoId: string) => {
    //ON FILTRE LES CONVERSATIONS
    const filteredConvo = conversations.filter((convo) => convo.id !== convoId);

    //ON CHECK SI C'EST LA SELECTEDCONVO, SI ON ON LA PASSE A UNDEFINED
    const selected = selectedConvo?.id === convoId ? undefined : selectedConvo;

    dispatch({
      type: "DELETE_CONVERSATION",
      payload: {
        conversation: filteredConvo,
        selected,
      },
    });
  };

  const updateAllMessages = (messages: MessageSelect[]) => {
    dispatch({
      type: "UPDATE_MESSAGES",
      payload: {
        conversations,
        messages,
      },
    });
  };

  const deleteMessageFromNewMessage = (messageId: string) => {
    const filtered = newMessage.filter((item) => item !== messageId);
    dispatch({ type: "UPDATE_MESSAGE_PUSHER", payload: filtered });
  };

  const updateConversations = (convos: ConversationListType) => {
    dispatch({
      type: "UPDATE_CONVERSATIONS",
      payload: convos,
    });
  };

  const updateSelectedConvo = async (convoId: string) => {
    const convo = conversations.find((convo) => convo.id === convoId);

    //SI LA CONVO CLIQU2 EST DEJA LA SELECTEDCONVO
    //OU SI PAS DE CONVO AVEC CET ID, ON FAST RETURN
    if (convo?.id === selectedConvo?.id || !convo) {
      return;
    }

    const fetchedMessages = await getConversationMessages(convoId);

    //SI LE DERNIER MESSAGE EST DEJA LU, ON DISPATCH SANS CHANGER CONVERSATIONS
    if (convo?.messages[0]?.isRead) {
      dispatch({
        type: "CHANGE_SELECTED_CONVO",
        payload: {
          selected: convo,
          conversations,
          messages: fetchedMessages,
        },
      });
      return;
    }

    //SINON ON CHANGE LE ISREAD DU DERNIER MESSAGE DE LA CONVERSATION
    const newConvos = conversations.map((c) => {
      //SI LA CONVO EST VIDE, ON RETURN
      if (c?.messages.length === 0) {
        return c;
      }
      //SI C'EST LA CONVO SUR LAQUELLE VIENT DE CLIQUER L'USER
      if (c.id === convo?.id && !c.messages[0]?.isRead) {
        //ON SPREAD LE MESSAGE ET ON PASSE ISREAD A TRUE
        const newM = { ...c.messages[0], isRead: true };

        //ON SPREAD LA CONVO ET ON LUI PASSE LE MESSAGE MIS A JOUR
        const newC: ConversationListItemType = { ...c, messages: [newM] };

        return newC;
      }

      //SINON ON RETURN LA CONVO TELLE QUELLE
      return c;
    });


    //ET ON DISPATCH AVEC LA NEWCONVO
    dispatch({
      type: "CHANGE_SELECTED_CONVO",
      payload: {
        selected: convo,
        conversations: newConvos,
        messages: fetchedMessages,
      },
    });
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //  GESTION DES NOTIFICATION /////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!userId || !notif) {
      console.log("pas de notif");
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
    pusherClient.bind("delete_conversation", (convoId: string) => {
      console.log("DELETE CONVERSATION PUSHER : ", convoId);
      deleteConversation(convoId);
    });

    //CREATION CONVERSATION
    pusherClient.bind(
      "create_conversation",
      (convo: ConversationListItemType) => {
        //ON MAP LE FORMAT DE LA DATE POUR EVITER LES BUGS D'AFFICHAGE
        const mappedMsg: MessageSelect = {
          ...convo.messages[0],
          createdAt: new Date(convo.messages[0].createdAt as Date),
        };

        const newConvos = { ...convo, messages: [mappedMsg] };
        const newMessageId = mappedMsg.id;

        dispatch({
          type: "NEW_CONVERSATION_PUSHER",
          payload: {
            conversation: [...conversations, newConvos],
            newMessage: [...newMessage, newMessageId],
          },
        });
      }
    );

    //NEW TRANSACTION
    pusherClient.bind("transaction_creation", (transactionId: string) => {
      dispatch({
        type: "NEW_TRANSACTION_PUSHER",
        payload: [...newTransaction, transactionId],
      });
    });

    //ON UNBSUBSCRIBE AU DEMONTAGE
    return () => {
      console.log("ON UNSUBSRIBE");
      pusherClient.unbind();
      pusherClient.unsubscribe(userId);
    };
  }, [userId, handleIncomingMessage]);

  return {
    state,
    addNewMessage,
    updateAllMessages,
    deleteConversation,
    updateConversations,
    updateSelectedConvo,
    deleteMessageFromNewMessage,
  };
};

const NotificationContext = createContext<
  ReturnType<typeof useNotificationContextValue>
>({} as ReturnType<typeof useNotificationContextValue>);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const pathname = usePathname();
  // const router = useRouter();
  // const notif = true;

  // const [userId, setUserId] = useState<string>();
  // const [conversations, setConversations] = useState<
  //   ConversationListItemType[]
  // >([]);
  // const [selectedConvo, setSelectedConvo] =
  //   useState<ConversationListItemType>();
  // const [messages, setMessages] = useState<MessageSelect[]>([]);
  // const [newMessage, setNewMessage] = useState<string[]>([]);
  // const [newTransaction, setNewTransaction] = useState<string[]>([]);

  // const selectedConvoRef = useRef(selectedConvo);
  // const conversationsRef = useRef(conversations);
  // const pathnameRef = useRef(pathname);
  // const messagesRef = useRef(messages);

  // //ON MET A JOUR LES REFS A CHAQUE RENDU
  // useEffect(() => {
  //   selectedConvoRef.current = selectedConvo;
  //   conversationsRef.current = conversations;
  //   pathnameRef.current = pathname;
  //   messagesRef.current = messages;
  // }, [selectedConvo, conversations, pathname, messages]);

  // //ON FETCH L'ID DE MESSAGES NON LUS
  // useEffect(() => {
  //   if (!userId) {
  //     return;
  //   }

  //   const getUnreadMsg = async (userId: string) => {
  //     const res = await getUnreadMessagesByUserId(userId);
  //     if (res) {
  //       const mappedRes =
  //         res
  //           .filter((item) => item.id !== null)
  //           .map((item) => item.id as string) || [];
  //       setNewMessage(mappedRes);
  //     }
  //   };
  //   getUnreadMsg(userId);
  // }, [userId]);

  // //FETCH DES TRANSACTIONS EN ATTENTE
  // useEffect(() => {
  //   if (!userId) {
  //     return;
  //   }
  //   const waitinTrans = async () => {
  //     const res = await getWaitingTransactions(userId);
  //     if (res) {
  //       const mapped = res.map((item) => item.id);
  //       setNewTransaction(mapped);
  //     }
  //   };
  //   waitinTrans();
  // }, [userId]);

  // //FONCTION POUR TRIER LES CONVERSATIONS
  // const sortConversationByLastMessageDate = () => {
  //   const sorted = [...conversationsRef.current].sort((a, b) => {
  //     // Si une conversation n'a pas de messages et l'autre en a,
  //     // celle sans messages vient en premier
  //     if (a.messages.length === 0 && b.messages.length > 0) {
  //       return -1;
  //     }
  //     if (b.messages.length === 0 && a.messages.length > 0) {
  //       return 1;
  //     }

  //     // Si les deux conversations n'ont pas de messages,
  //     // on les trie par date de création (la plus récente en premier)
  //     if (a.messages.length === 0 && b.messages.length === 0) {
  //       return (b.createdAt?.valueOf() || 0) - (a.createdAt?.valueOf() || 0);
  //     }

  //     // Si les deux conversations ont des messages,
  //     // on les trie par date du dernier message (le plus récent en premier)
  //     const lastMessageA = a.messages[a.messages.length - 1];
  //     const lastMessageB = b.messages[b.messages.length - 1];
  //     return (
  //       (lastMessageB.createdAt?.valueOf() || 0) -
  //       (lastMessageA.createdAt?.valueOf() || 0)
  //     );
  //   });

  //   setConversations(sorted);
  // };

  // const handleIncomingMessage = (msg: MessageSelect) => {
  //   //ON CHECK SI L'USER EST SUR LA PAGE DES CONVO ET QUE LA SELECTEDCONVO CORRESPOND AU MESSAGE ENTRANT
  //   if (
  //     selectedConvoRef.current?.id === msg.conversationId &&
  //     pathnameRef.current.startsWith("/messages")
  //   ) {
  //     //SI LA SELECTEDCONVO.ID === NEWMESSAGE.CONVOID, ALORS ON L'AJOUTE AU MESSAGE
  //     console.log("ON ANRETRE DANS LE IF");
  //     return addNewMessage(msg);
  //   }

  //   //SINON ON AJOUTE L'ID DU MESSAGE A NEWMESSAGES POUR LA NAVBAR
  //   setNewMessage((previous) => [...previous, msg.id]);

  //   //ET ON UPDATE LE DERNIER MESSAGE DE LA CONVERSATION A LAQQUELLE LE MESSAGE APPARTIENT
  //   const newConvos = conversationsRef.current.map((convo) => {
  //     if (convo.id === msg.conversationId) {
  //       const newC = { ...convo, messages: [msg] };
  //       return newC;
  //     }
  //     return convo;
  //   });
  //   console.log("NEW CONVOS : ", newConvos);
  //   setConversations(newConvos);
  // };

  // ///////////////////////////////
  // //  GESTION DES NOTIFICATION //
  // ///////////////////////////////
  // useEffect(() => {
  //   if (!userId || !notif) {
  //     console.log("pas de notif");
  //     return;
  //   }
  //   pusherClient.subscribe(userId);

  //   //INCOMING MESSAGE
  //   pusherClient.bind("new_message", (msg: MessageSelect) => {
  //     console.log("ON RENTRE DANS LE BIND NEW_MESSAGE");
  //     const mappedMsg: MessageSelect = {
  //       ...msg,
  //       createdAt: new Date(msg.createdAt!),
  //     };
  //     handleIncomingMessage(mappedMsg);
  //   });

  //   //DELETED CONVERSATION
  //   pusherClient.bind("delete_conversation", (convoId: string) => {
  //     console.log("DELETE CONVERSATION PUSHER : ", convoId);
  //     deleteConversationFromState(convoId);
  //   });

  //   //CREATION CONVERSATION
  //   pusherClient.bind(
  //     "create_conversation",
  //     (convo: ConversationListItemType) => {
  //       const mappedMsg: MessageSelect = {
  //         ...convo.messages[0],
  //         createdAt: new Date(convo.messages[0].createdAt as Date),
  //       };
  //       setConversations([
  //         ...conversationsRef.current,
  //         { ...convo, messages: [mappedMsg] },
  //       ]);
  //       setNewMessage((previous) => [...previous, convo.messages[0].id]);
  //     }
  //   );

  //   //NEW TRANSACTION
  //   pusherClient.bind("transaction_creation", (transactionId: string) => {
  //     setNewTransaction((previous) => [...previous, transactionId]);
  //   });

  //   //ON UNBSUBSCRIBE AU DEMONTAGE
  //   return () => {
  //     console.log("ON UNSUBSRIBE");
  //     pusherClient.unbind();
  //     pusherClient.unsubscribe(userId);
  //   };
  // }, [userId]);

  // //AJOUTER LE DERNIER MESSAGE AUX AUTRES
  // const addNewMessage = (newMsg: MessageSelect) => {
  //   setMessages([...messagesRef.current, newMsg]);

  //   //ON MET A JOUR CONVERSATIONS POUR METTRE A JOUR LA DATE DU DERNIER MESSAGE
  //   const updatedConvos = conversationsRef.current.map((convo) => {
  //     if (convo.id !== newMsg.conversationId) {
  //       return convo;
  //     }
  //     const newC: typeof convo = {
  //       ...convo,
  //       messages: [{ ...newMsg, isRead: true }],
  //     };
  //     return newC;
  //   });
  //   setConversations(updatedConvos);
  // };

  // //SUPPRESSION D'UNE CONVERSATION
  // const deleteConversationFromState = (convoId: string) => {
  //   const filteredConvo = conversationsRef.current.filter(
  //     (convo) => convo.id !== convoId
  //   );
  //   setConversations(filteredConvo);
  //   if (selectedConvoRef.current?.id === convoId) {
  //     setSelectedConvo(undefined);
  //   }
  // };

  const value = useNotificationContextValue();

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
