import { Location2D } from '@/interfaces/node';
import { Point, Segment } from '@flatten-js/core';
import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { NodeSocketData } from '../../interfaces/socket';
import { useOperatorsData } from '../providers/OperatorsProvider';
import BaseLink from './BaseLink';

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
  const withOperatorsData = useOperatorsData();

  onCleanup(() => {
    const [, setLinked] = props.toSocket.linkSocket
    setLinked()
  })

  withOperatorsData(data => {
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
