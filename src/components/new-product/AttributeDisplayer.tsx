// import { AttributeSelect } from "@/drizzle/schema";
// import React, { Dispatch, FC } from "react";
// import UncontrolledInput from "../inputs/UncontrolledInput";
// import AttributeSelectInput from "./AttributeSelectInput";
// import { z } from "zod";

// interface IProps {
//   attribute: AttributeSelect;
//   setDynamicAttributes: Dispatch<Record<string, z.ZodType<any, any>>>;
//   dynamicAttributes?: Record<string, z.ZodType<any, any>>;
//   name: string;
// }

// const AttributeDisplayer: FC<IProps> = ({ attribute, setDynamicAttributes, name,  dynamicAttributes = {} }) => {

//   switch (attribute.type) {
//     case "boolean":
//       setDynamicAttributes({...dynamicAttributes, [attribute.name]: z.string()})
//       return <div>Boolean</div>;
//     case "text":
//     case "number":
//       return (
//         <UncontrolledInput
//           required={attribute.required ?? undefined}
//           label={attribute.label}
//           name={name}
//           type={attribute.type}
//         />
//       );
//     case "select":
//       return <AttributeSelectInput attribute={attribute} name={name} />;
//     default:
//       return <p className="error_message">Probléme de récupération</p>;
//   }
// };

// export default AttributeDisplayer;
