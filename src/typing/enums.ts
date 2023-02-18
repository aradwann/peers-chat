export enum MessageSender {
    local = 'local',
    remote = 'remote'
}

export enum SignalMessageType {
    offer = "offer",
    answer = "answer",
    candidate = "candidate",
    ready = "ready",
    bye = "bye",
    default = "default"
}