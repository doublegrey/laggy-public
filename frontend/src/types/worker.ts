export interface Worker {
  id: string;
  name: string;
  profile: string;
  status: string;
  created: Date;
  hashrate: number;
  targetHashrate: number;
  additionalPower: number;
  runningSince: Date;
  cpu: number;
  ram: number;
  storage: number;
  power: number;
  gpus: GPU[];
}

export interface GPU {
  pci: number;
  name: string;
  load: number;
  chip: number;
  mem: number;
  fan: number;
  coreClock: number;
  memClock: number;
  power: number;
  hashrate: number;
  acceptedShares: number;
  rejectedShares: number;
}
