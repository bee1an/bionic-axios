import CancelError from './CancelError'

export default function (thing: unknown): thing is CancelError {
  return thing instanceof CancelError && thing.__CANCEL__
}
