import { SenderProps } from "../../typing/interfaces"
import { createMessageComponent } from "../utils"

const localProps: SenderProps = {
    className: "container",
    imageSource: "/pepe-smile.png",
    labelClass: "peer-left",
    labelName: "Local",
    timeAligment: "time-right"
}
const LocalMessage = createMessageComponent(localProps)

export { LocalMessage }