import modernDress from '../assets/dresses/modern-wrap/modern-dress-base-cutout.png'
import modernHighNeck from '../assets/dresses/modern-wrap/neckline-modern/neckline.png'
import modernStrapsOne from '../assets/dresses/modern-wrap/straps/straps1.png'
import modernStrapsTwo from '../assets/dresses/modern-wrap/straps/straps2.png'

import bishopLeft from '../assets/dresses/classic-wrap/sleeves/bishop-left.png'
import bishopRight from '../assets/dresses/classic-wrap/sleeves/bishop-right.png'
import flutterLeft from '../assets/dresses/classic-wrap/sleeves/flutter-left.png'
import flutterRight from '../assets/dresses/classic-wrap/sleeves/flutter-right.png'

import squareNeckline from '../assets/dresses/classic-wrap/necklines/square.png'
import wrapVNeckline from '../assets/dresses/classic-wrap/necklines/wrap-v.png'

import belt from '../assets/dresses/classic-wrap/overlays/belt.png'
import cascadeHem from '../assets/dresses/classic-wrap/hems/cascade.png'
import tulipHem from '../assets/dresses/classic-wrap/hems/wrap-tulip.png'
import classicCorsetSweetheart from '../assets/f0f37434-cd35-4f97-bb1f-2825b3e2734a.png'
import classicCorsetScoop from '../assets/86a5a2b7-f3a7-4001-b8f4-c105d0cc79cc.png'
import classicCorsetStraight from '../assets/c1d2e6b0-2426-45f1-bc35-5ee90a9426f4.png'
import modernCorsetBowStraps from '../assets/descarga.png'
import modernCorsetBuckleStraps from '../assets/descarga (1).png'
import modernCorsetRuffleStraps from '../assets/descarga (3).png'

// Todas las coordenadas están en píxeles del vestido base (width x height).
//
// Cada capa sustituye una zona del vestido:
// - `componentId`: componente del editor cuya opción elegida decide la pieza.
// - `hide`: polígono del vestido base que se oculta; puede variar por pieza.
// - `pieces[opción]`: imagen y rectángulo (x, y, width, height) donde se coloca.
//   `bottomEdge` (opcional) define el borde inferior en coordenadas originales.
//   `clip` (opcional) polígono fuera del cual no se dibujan las piezas de la capa.
// - `overlay` (opcional): imagen que se dibuja encima de la pieza elegida.
export const dressConfigs = {
  7: {
    name: 'Modern Corset',
    base: null,
    layerFilter: 'modern-bodice-tone',
    width: 1155,
    height: 1412,
    layers: [
      {
        slot: 'modern-corset-straps',
        componentId: '73',
        alt: 'Modern corset strap variation',
        pieces: {
          'Bow-tie Straps': {
            src: modernCorsetBowStraps,
            x: 69.4,
            y: 96.1,
            width: 1037.2,
            height: 1231.7,
          },
          'Buckle Straps': {
            src: modernCorsetBuckleStraps,
            x: 158.3,
            y: 87.4,
            width: 834.4,
            height: 1242,
          },
          'Ruffle Straps': {
            src: modernCorsetRuffleStraps,
            x: 55,
            y: 80,
            width: 1045,
            height: 1252,
          },
        },
      },
    ],
  },
  6: {
    name: 'Classic Corset',
    base: null,
    layerFilter: 'modern-bodice-tone',
    width: 1155,
    height: 1412,
    layers: [
      {
        slot: 'corset-neckline',
        componentId: '52',
        alt: 'Classic corset neckline variation',
        pieces: {
          Sweetheart: {
            src: classicCorsetSweetheart,
            x: 55,
            y: 80,
            width: 1045,
            height: 1252,
          },
          Scoop: {
            src: classicCorsetScoop,
            x: 75.5,
            y: 55,
            width: 1004,
            height: 1302,
          },
          Straight: {
            src: classicCorsetStraight,
            x: 55,
            y: 80,
            width: 1045,
            height: 1252,
          },
        },
      },
    ],
  },
  1: {
    name: 'Classic Dress',
    base: null,
    width: 1024,
    height: 1536,
    layers: [
      {
        slot: 'sleeve-left',
        componentId: '3',
        alt: 'Left sleeve variation',
        hide: '120,60 300,60 303,93 312,140 326,200 332,260 336,330 344,372 350,386 120,386',
        pieces: {
          Bishop: { src: bishopLeft, x: 124.4, y: 82.1, width: 233.2, height: 444.7 },
          Bell: { src: flutterLeft, x: 136, y: 84, width: 247.2, height: 303.1 },
        },
      },
      {
        slot: 'sleeve-right',
        componentId: '7',
        alt: 'Right sleeve variation',
        hide: '724,60 900,60 900,386 668,386 674,378 680,350 692,290 698,200 712,130 722,93',
        pieces: {
          Bishop: { src: bishopRight, x: 664.3, y: 82.1, width: 233.4, height: 444.8 },
          Bell: { src: flutterRight, x: 639.8, y: 84, width: 247.2, height: 304 },
        },
      },
      {
        slot: 'neckline',
        componentId: '2',
        alt: 'Neckline variation',
        hide: '304,40 724,40 722,93 712,130 698,200 692,290 680,350 674,378 666,400 645,476 376,476 352,385 344,372 336,330 332,260 326,200 312,140 302,96',
        pieces: {
          Square: { src: squareNeckline, x: 293.7, y: 56.6, width: 435.5, height: 438.2 },
          'V-neck': { src: wrapVNeckline, x: 293.6, y: 55.2, width: 434.6, height: 439.6 },
        },
      },
      {
        slot: 'hem',
        componentId: '40',
        alt: 'Hem variation',
        // El cinturón tapa la unión entre el cuerpo y la falda.
        overlay: { src: belt, x: 372, y: 451, width: 273, height: 59 },
        // Lazo dibujado en vectores con el mismo trazo y tono que la ilustración.
        drawings: [
          {
            d: 'M642 530 L668 532 C678 610 686 700 684 836 L662 858 L646 838 L636 852 C630 730 636 630 642 530 Z',
            shade: 'M656 548 C664 650 666 740 660 838',
          },
          {
            d: 'M660 528 L682 524 C704 610 726 690 738 778 L716 800 L702 778 L690 792 C680 700 668 620 660 528 Z',
            shade: 'M674 548 C692 630 710 700 720 780',
          },
          {
            d: 'M660 522 C690 540 738 554 760 580 C774 598 762 622 738 620 C706 616 672 580 656 542 Z',
            shade: 'M668 538 C700 556 732 580 746 606',
          },
          {
            d: 'M660 500 C692 478 748 482 770 504 C782 520 768 542 744 546 C712 550 682 536 658 520 Z',
            shade: 'M666 506 C702 498 742 508 756 526',
          },
          {
            d: 'M622 494 C634 486 650 486 662 494 C666 510 664 526 656 534 C642 538 628 534 622 526 C618 514 618 502 622 494 Z',
            shade: 'M634 498 C642 508 644 520 640 530',
          },
        ],
        pieces: {
          Ruffled: {
            src: cascadeHem,
            x: 91.8,
            y: 444.7,
            width: 820.8,
            height: 1034.6,
            topFade: { inset: 20, height: 30 },
          },
          Asymmetric: {
            src: tulipHem,
            x: 198,
            y: 444,
            width: 616.6,
            height: 997.5,
            topFade: { inset: 20, height: 30 },
          },
        },
      },
    ],
  },
  // Preparado: añadir aquí las capas cuando existan piezas para el moderno.
  2: {
    name: 'Modern Dress',
    base: modernDress,
    baseFilter: 'modern-base-tone',
    layerFilter: 'modern-bodice-tone',
    width: 1024,
    height: 1536,
    layers: [
      {
        slot: 'bodice',
        componentId: '8',
        alt: 'Bodice variation',
        pieces: {
          'High Neck': {
            src: modernHighNeck,
            x: 301.5,
            y: 20,
            width: 421,
            height: 371,
            sourceWidth: 451,
            sourceHeight: 401,
            bottomEdge: 'M 64 379 C 135 375 310 375 382 379',
          },
          'Sweetheart Straps': {
            src: modernStrapsOne,
            x: 275,
            y: 77,
            width: 474,
            height: 299,
            sourceWidth: 424,
            sourceHeight: 329,
            bottomEdge: 'M 62 284 C 77 299 96 303 130 304 C 183 304 244 303 290 304 C 320 305 340 306 360 296',
          },
          'Off-Shoulder': {
            src: modernStrapsTwo,
            x: 182,
            y: 273,
            width: 660,
            height: 253,
            sourceWidth: 560,
            sourceHeight: 253,
            bottomEdge: 'M 172 233 C 225 233 335 233 386 233',
          },
        },
      },
    ],
  },
}

// Opciones con pieza para un componente; null si el componente no tiene capa.
export function getAvailableOptions(garmentId, componentId) {
  const layer = dressConfigs[garmentId]?.layers.find(
    (item) => String(item.componentId) === String(componentId)
  )
  return layer ? Object.keys(layer.pieces) : null
}
