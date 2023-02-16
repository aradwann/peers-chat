import { SenderProps } from "../../typing/interfaces"
import { createMessageComponent } from "../utils"

const remoteProps: SenderProps = {
    className: "container darker",
    imageSource: "/pepe-cool-mirrored.png",
    imageAlignment: 'right',
    labelClass: "peer-right",
    labelName: "Remote",
    timeAligment: "time-left"
}
const RemoteMessage = createMessageComponent(remoteProps)

export { RemoteMessage }