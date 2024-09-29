import { MessageSelect } from "@/drizzle/schema";
import {
  ConversationListItemType,
  ConversationListType,
} from "@/lib/requests/conversation.request";

type Action =
  | { type: "UPDATE_CONVERSATIONS"; payload: ConversationListType }
  | {
      type: "CHANGE_SELECTED_CONVO";
      payload: {
        selected: ConversationListItemType;
        conversations: ConversationListType;
        messages: MessageSelect[];
      };
    }
  | {
      type: "HANDLE_INCOMING_MESSAGE";
      payload: {
        newMessage: string[];
        conversations: ConversationListType;
      };
    }
  | { type: "NEW_TRANSACTION_PUSHER"; payload: string[] }
  | { type: "UPDATE_USER_ID"; payload: string }
  | { type: "UPDATE_MESSAGE_PUSHER"; payload: string[] }
  | {
      type: "UPDATE_MESSAGES";
      payload: {
        messages: MessageSelect[];
        conversations: ConversationListType;
      };
    }
  | {
      type: "DELETE_CONVERSATION";
      payload: {
        conversation: ConversationListType;
        selected: ConversationListItemType | undefined;
      };
    }
  | {
      type: "NEW_CONVERSATION_PUSHER";
      payload: {
        conversation: ConversationListType;
        newMessage: string[];
      };
    };

interface IState {
  messages: MessageSelect[];
  newMessage: string[];
  newTransaction: string[];
  conversations: ConversationListType;
  selectedConvo: ConversationListItemType | undefined;
  userId: string | undefined;
}
export const initialState: IState = {
  messages: [],
  newMessage: [],
  newTransaction: [],
  conversations: [],
  selectedConvo: undefined,
  userId: undefined,
};

export const notificationReducer = (
  state: IState = initialState,
  action: Action
): IState => {
  switch (action.type) {
    case "UPDATE_MESSAGES":
      console.log(action);
      return {
        ...state,
        messages: action.payload.messages,
        conversations: action.payload.conversations,
      };
    case "CHANGE_SELECTED_CONVO":
      console.log(action);
      return {
        ...state,
        selectedConvo: action.payload.selected,
        conversations: action.payload.conversations,
        messages: action.payload.messages
      };
    case "HANDLE_INCOMING_MESSAGE":
      console.log(action);
      return {
        ...state,
        newMessage: action.payload.newMessage,
        conversations: action.payload.conversations,
      };
    case "NEW_TRANSACTION_PUSHER":
      console.log(action);
      return {
        ...state,
        newTransaction: action.payload,
      };
    case "UPDATE_CONVERSATIONS":
      console.log(action);
      return {
        ...state,
        conversations: action.payload,
      };
    case "UPDATE_USER_ID":
      console.log(action);
      return {
        ...state,
        userId: action.payload,
      };
    case "UPDATE_MESSAGE_PUSHER":
      console.log(action);
      return {
        ...state,
        newMessage: action.payload,
      };
    case "DELETE_CONVERSATION":
      console.log(action);
      return {
        ...state,
        conversations: action.payload.conversation,
        selectedConvo: action.payload.selected,
      };
    case "NEW_CONVERSATION_PUSHER":
      console.log(action);
      return {
        ...state,
        conversations: action.payload.conversation,
        newMessage: action.payload.newMessage,
      };
    default:
      console.log("ACTION DEFAULT");
      return state;
  }
};
