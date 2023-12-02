import { Location2D } from '@/interfaces/node';
import { createEffect, createSignal, useContext, createMemo, onCleanup } from 'solid-js';
import { NodeSocketData } from '../NodeSocket/SocketsData';
import BaseLink from './BaseLink';
import { whenNotUndefined } from '@/utils/props';
import { OperatorsData } from '../Workloard/OperatorsProvider';
import { Segment, Point } from '@flatten-js/core';

export interface Props {
  fromSocket: NodeSocketData;
  toSocket: NodeSocketData;
  id: symbol;
}

function offsetSocket(pin: Location2D): Location2D {
  return {
    left: pin.left + 7,
    top: pin.top + 7,
  };
}

function NodeLink(props: Props) {
  const [start, setStartPoint] = createSignal<Location2D>({
    left: 0,
    top: 0,
  });
  const [end, setEndPoint] = createSignal<Location2D>({
    left: 0,
    top: 0,
  });
  const useOperatorsData = whenNotUndefined(useContext(OperatorsData))

  onCleanup(() => {
    props.toSocket.linkSocket[1]()
  })

  useOperatorsData(data => {
    const d = createMemo((): Segment => {
      const pin = props.toSocket.pinPosition() ?? { left: 0, top: 0 };
      const ep = offsetSocket(pin);
      const ps = new Point(start().left, start().top);
      const pe = new Point(ep.left, ep.top);
      return new Segment(ps, pe);
    });
    data.geometry.links[props.id] = d;
  })

  createEffect(() => {
    const pin = props.fromSocket.pinPosition();
    if (pin) setStartPoint(offsetSocket(pin));
  });

  createEffect(() => {
    const pin = props.toSocket.pinPosition();
    if (pin) {
      const sp = start();
      setEndPoint(offsetSocket({
        left: pin.left - sp.left,
        top: pin.top - sp.top,
      }));
    }
  });

  console.info('[Render]::NodeLink Render');

  return <BaseLink start={start} end={end} />;
}

export default NodeLink;
