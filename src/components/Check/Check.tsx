import { FC } from 'react';

type Props = {
  checked:boolean
}

export const Check:FC<Props> = ({checked}) => {
  return checked?<span>✅</span>:<span>🚫</span>
};
