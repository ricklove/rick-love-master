export type GraphicsService = {
  addObject: (args: {
    shape: 'box' | 'sphere';
    visible: boolean;
    position: [number, number, number];
    quaternion: [number, number, number, number];
    scale: [number, number, number];
    color: number;
  }) => { id: string };
  removeObject: (id: string) => void;
  setVisible: (id: string, visible: boolean) => void;
  setTransform: (id: string, position: [number, number, number], quaternion: [number, number, number, number]) => void;
};
