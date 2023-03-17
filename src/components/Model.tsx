import { MODEL_MESSAGES } from "../utils/data";


interface ModelProps {
  id: keyof typeof MODEL_MESSAGES,
  title?: string,
  content?: string,
  button?: string,
  isShown: boolean,
  onShown: (isShown: boolean) => void,
}
const Model = (props: ModelProps) => {
  let { id, title, content, button, isShown, onShown } = props;
  content = MODEL_MESSAGES[id];
  return (
    <div>
      <input type="checkbox" id={id} className="modal-toggle" checked={isShown} onChange={() => {onShown(false)}}/>
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="py-4">{content}</p>
          <div className="modal-action">
            <button className="btn rounded-full" onClick={() => {onShown(false)}}>{button || 'Close'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Model;
