import { useRef } from "react";
import clsx from "clsx";
import { useDrag, useDrop } from "react-dnd";
import "./box.css";

const ItemTypes = {
  ITEM: "item",
};

const style = {
  cursor: "move",
};

export default function Box({ item = {}, id, index, moveItem } = {}) {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.ITEM,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      className={clsx(item.size, "box")}
      ref={ref}
      data-handler-id={handlerId}
      style={{ ...style, opacity }}
    >
      <p>
        <span className="icon">
          <svg
            t="1725855856924"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1506"
            width="200"
            height="200"
          >
            <path
              d="M317.056 128L128 344.064V896h768V344.064L706.944 128z m-14.528-64h418.944a32 32 0 0 1 24.064 10.88l206.528 236.096A32 32 0 0 1 960 332.032V928a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V332.032a32 32 0 0 1 7.936-21.12L278.4 75.008A32 32 0 0 1 302.528 64"
              p-id="1507"
            ></path>
            <path d="M64 320h896v64H64z" p-id="1508"></path>
            <path
              d="M448 327.872V640h128V327.872L526.08 128h-28.16zM448 64h128l64 256v352a32 32 0 0 1-32 32H416a32 32 0 0 1-32-32V320z"
              p-id="1509"
            ></path>
          </svg>
        </span>
        <span className="number">{item.number}</span>
      </p>
      <div className={clsx('button',{
        'button-green':item.status==='完了',
        'button-yellow':item.status==='検証進捗 1/7'
      })}>{item.status}</div>
    </div>
  );
}
