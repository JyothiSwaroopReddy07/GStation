'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';



const defaultDate = format(new Date(), 'yyyy-MM-dd');

interface CigaretteRow {
  rack: number;
  pack_name: string;
  start_am: number;
  stocked_am: number;
  end_am: number;
  count_sold_am: number;
  start_pm: number;
  stocked_pm: number;
  end_pm: number;
  count_sold_pm: number;
  purchase_of_the_day: number;
  sold_pack: number;
  stocked_carton: number;
}


const rackColors: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-lime-500',
  5: 'bg-green-500',
  6: 'bg-emerald-500',
  7: 'bg-cyan-500',
  8: 'bg-sky-500',
  9: 'bg-blue-500',
  10: 'bg-indigo-500',
  11: 'bg-violet-500',
  12: 'bg-purple-500',
  13: 'bg-fuchsia-500',
  14: 'bg-pink-500',
  15: 'bg-rose-500',
  16: 'bg-stone-500',
  17: 'bg-gray-500'
};

const getExcelFillColor = (rack: number): string => {
  const rackColorMap: Record<number, string> = {
    1: 'FFEF4444',  // red-400
    2: 'FFF97316',  // orange-500
    3: 'FFEAB308',  // yellow-400
    4: 'FF84CC16',  // lime-500
    5: 'FF22C55E',  // green-500
    6: 'FF10B981',  // emerald-500
    7: 'FF06B6D4',  // cyan-500
    8: 'FF0EA5E9',  // sky-500
    9: 'FF3B82F6',  // blue-500
    10: 'FF6366F1', // indigo-500
    11: 'FF8B5CF6', // violet-500
    12: 'FFA855F7', // purple-500
    13: 'FFEC4899', // fuchsia-500
    14: 'FFF472B6', // pink-400
    15: 'FFF43F5E', // rose-500
    16: 'FFA8A29E', // stone-400
    17: 'FFD4D4D8'  // gray-300
  };
  return rackColorMap[rack] || 'FFFFFFFF'; // default white
};


const predefinedRows: CigaretteRow[] = [
  { rack: 1, pack_name: 'VIRGINIA SLIMS GOLD 120', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 1, pack_name: 'VIRGINIS SLIMS GOLD 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 1, pack_name: 'VIRGINIA SLIMS SILVER 120', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 1, pack_name: 'VIRGINIA SLIMS SILVER 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 1, pack_name: 'VIRGINIA SLIMS SILVER MENTHOL 120', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 1, pack_name: 'VIRGINIA SLIMS SILVER MENTHOL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 1, pack_name: 'VIRGINIA SLIMS GOLD MENTHOL 120', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 1, pack_name: 'VIRGINIA SLIMS GOLD MENTHOL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 1, pack_name: 'VIRGINIA SLIMS MENTHOL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 2, pack_name: 'LD RED 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 2, pack_name: 'LD RED SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 2, pack_name: 'LD BLUE 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 2, pack_name: 'LD BLUE SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 2, pack_name: '', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 2, pack_name: 'LD MENTHOL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 2, pack_name: 'LD MENTHOL SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 2, pack_name: '', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 2, pack_name: 'L&M BLUE SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 3, pack_name: 'MONTEGOS RED 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 3, pack_name: 'MONTEGOS RED SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 3, pack_name: 'MONTEGOS BLUE 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 3, pack_name: 'MONTEGOS BLUE SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 3, pack_name: 'MONTEGOS ORANGE 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 3, pack_name: 'MONTEGOS MENTHOL GOLD 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 3, pack_name: 'MONTEGOS MENTHOL GOLD SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 3, pack_name: 'MONTEGOS MENTHOL SILVER 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 3, pack_name: 'MONTEGOS MENTHOL SILVER SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 4, pack_name: 'EAGLES RED 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 4, pack_name: 'EAGLES RED SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 4, pack_name: 'EAGLES NON-FILTERS', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 4, pack_name: 'CROWN RED 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 4, pack_name: 'CROWN RED SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 4, pack_name: 'CROWN GOLD 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 4, pack_name: 'CROWN GOLD SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 4, pack_name: 'CROWN MENTHOL SILVER 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 4, pack_name: 'CROWN MENTHOL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 5, pack_name: 'MARLBORO BLK 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 5, pack_name: 'MARLBORO BLK SHORT ', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 5, pack_name: 'MARLBORO BLK MENTHOL 100 ', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 5, pack_name: 'MARLBORO BLK MENTHOL SHORT ', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 5, pack_name: 'MARLBORO BLK GOLD ', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 5, pack_name: 'MARLBORO NXT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 5, pack_name: 'MARLBORO SLATE 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 5, pack_name: 'MARLBORO SLATE SHORT ', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 5, pack_name: 'MARLBORO MIDNIGHT SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 6, pack_name: 'MARLBORO RED-LABEL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 6, pack_name: 'MARLBORO RED-LABEL SHORT ', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 6, pack_name: 'MARLBORO RED SPECIAL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 6, pack_name: 'MARLBORO RED SPECIAL SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 6, pack_name: 'MARLBORO GOLD SPECIAL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 6, pack_name: 'MARLBORO GOLD SPECIAL SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 6, pack_name: 'MARLBORO 72 RED', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 6, pack_name: 'MARLBORO 72 GOLD', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 6, pack_name: 'MARLBORO 72 SILVER', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 7, pack_name: 'MARLBORO RED 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 7, pack_name: 'MARLBORO RED SHORT ', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 7, pack_name: 'MARLBORO GOLD 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 7, pack_name: 'MARLBORO GOLD SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 7, pack_name: 'MARLBORO SILVER 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 7, pack_name: 'MARLBORO SILVER SHORT ', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 7, pack_name: 'MARLBORO 27 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 7, pack_name: 'MARLBORO 27 SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 7, pack_name: 'MARLBORO SOUTHERN CUT SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 8, pack_name: 'MARLBORO MENTHOL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 8, pack_name: 'MARLBORO MENTHOL SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 8, pack_name: 'MARLBORO MENTHOL GOLD 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 8, pack_name: 'MARLBORO MENTHOL GOLD SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 8, pack_name: 'MARLBORO MENTHOL SILVER 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 8, pack_name: 'MARLBORO MENTHOL SILVER SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 8, pack_name: 'MARLBORO SMOOTH 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 8, pack_name: 'MARLBORO SMOOTH SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 8, pack_name: 'MARLBORO ICE', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 9, pack_name: 'PYRAMID ORANGE 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 9, pack_name: 'AMERICAN SPIRIT RED', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 9, pack_name: 'AMERICAN SPIRIT SKY', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 9, pack_name: 'AMERICAN SPIRIT BLUE', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 9, pack_name: 'AMERICAN SPIRIT BLK', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 9, pack_name: 'AMERICAN SPIRIT YELLOW ', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 9, pack_name: 'AMERICAN SPIRIT TURIQUWAH', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 9, pack_name: 'AMERICAN SPIRIT GOLD', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 9, pack_name: 'AMERICAN SPIRIT GREEN', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 10, pack_name: 'WINSTON WHITE 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 10, pack_name: 'WINSTON RED 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 10, pack_name: 'WiNSTON RED SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 10, pack_name: 'WINSTON GOLD 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 10, pack_name: 'WINSTON GOLD SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 10, pack_name: '', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 10, pack_name: '', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 10, pack_name: '', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 10, pack_name: '', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 11, pack_name: 'SKYDANCER GOLD 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 11, pack_name: 'SCYDANCER GOLD SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 11, pack_name: 'SKYDANCER BLK 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 11, pack_name: 'SKYDANCER BLK SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 11, pack_name: 'SKYDANCER SILVER 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 11, pack_name: 'SKYDANCER SILVER SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 11, pack_name: 'SWISHER SWEETS RED', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 11, pack_name: 'SUPREME RED 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 11, pack_name: 'SUPREME GOLD 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 12, pack_name: '305 MENTHOL GOLD 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 12, pack_name: '305 MENTHOL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 12, pack_name: '305 BLUE 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 12, pack_name: '305 FULL FLAVOR SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 12, pack_name: 'GPC MENTHOL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 12, pack_name: 'CLIPPER RED 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 12, pack_name: 'CLIPPER MENTHOL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 12, pack_name: 'MARLBORO SMOOTH ICE', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 12, pack_name: 'MARLBORO 72 BLK MENTHOL', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 13, pack_name: 'NEWPORT RED 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 13, pack_name: 'NEWPORT MENTHOL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 13, pack_name: 'NEWPORT MENTHOL SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 13, pack_name: 'LUCKY STRIKE RED 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 13, pack_name: 'LUCKY STRIKE RED SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 13, pack_name: 'LUCKY STRIKE GOLD 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 13, pack_name: 'LUCKY STRIKE GOLD SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 13, pack_name: 'LUCKY STRIKE BLUE ACTIVATE', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 13, pack_name: '', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 14, pack_name: 'KOOL LUXE GOLD 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 14, pack_name: 'KOOL LUXE GOLD SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 14, pack_name: 'KOOL LUXE BLK 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 14, pack_name: 'KOOL LUXE BLK SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 14, pack_name: 'KOOL BLUE 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 14, pack_name: 'KOOL MENTHOL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 14, pack_name: 'KOOL MENTHOL SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 14, pack_name: 'BERKLEY GOLD 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 14, pack_name: 'BERKLEY GOLD SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 15, pack_name: 'CAMEL NON-FILTER', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 15, pack_name: '', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 15, pack_name: 'PALL MALL RED 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 15, pack_name: 'PALL MALL RED SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 15, pack_name: 'PALL MALL BLUE 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 15, pack_name: 'PALL MALL BLUE SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 15, pack_name: 'PALL MALL ORANGE 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 15, pack_name: 'PALL MALL MENTHOL 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 15, pack_name: 'PALL MALL MENTHOL SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 16, pack_name: 'CAMEL BLUE 99', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 16, pack_name: 'CAMEL BLUE SHORT ', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 16, pack_name: 'CAMEL RED 99', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 16, pack_name: 'CAMEL RED SHORT', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 16, pack_name: 'CAMEL CRUSH NON-MENTHOL', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 16, pack_name: 'CAMEL CRUSH MENTHOL', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 16, pack_name: 'CAMEL CRUSH SILVER', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 16, pack_name: 'CAMEL SMOOTH NO9', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 16, pack_name: 'CAMEL SMOOTH ', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 17, pack_name: 'CAMEL WIDES ', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 17, pack_name: 'CLIPPER CHERRY 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 17, pack_name: 'CLIPPER BLUE 100', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 17, pack_name: '', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 },
  { rack: 17, pack_name: '', start_am: 0, stocked_am: 0, end_am: 0, count_sold_am: 0, start_pm: 0, stocked_pm: 0, end_pm: 0, count_sold_pm: 0, purchase_of_the_day: 0, sold_pack: 0, stocked_carton: 0 }
];


export default function Home() {
  const [rows, setRows] = useState<CigaretteRow[]>(predefinedRows);
  const [selectedDate, setSelectedDate] = useState<string>(defaultDate);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://0.0.0.0:8000/logs/?date=${selectedDate}`)
      .then((res) => {
        if (res.data.length > 0) {
          setRows(res.data);
        } else {
          setRows(predefinedRows.map(row => ({ ...row })));
        }
      })
      .catch(() => {
        setRows(predefinedRows.map(row => ({ ...row })));
      })
      .finally(() => setIsLoading(false));
  }, [selectedDate]);

  const handleChange = (index: number, key: keyof CigaretteRow, value: string | number) => {
    const updated = [...rows];
    if (key !== 'pack_name' && key !== 'rack') {
      updated[index][key] = parseFloat(value as string) || 0;
    }
    setRows(updated);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://0.0.0.0:8000/logs/', {
        date: selectedDate,
        rows,
      });
      console.log(res);
      setRows(res.data); // update table with response data
      alert('Saved to backend and updated!');
    } catch (err) {
      console.error("Failed to save rows:", err);
    }
    finally{
      setIsLoading(false);
    }
  };
  
  

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Cigarette Log");
  
    const headers = [
      'Rack', 'Pack Name', 'Start AM', 'Stocked AM', 'End AM', 'Sold AM',
      'Start PM', 'Stocked PM', 'End PM', 'Sold PM',
      'Purchase', 'Sold Pack', 'Stocked Carton'
    ];
  
    // Add header row
    sheet.addRow(headers);
  
    // Add each row and style rack + pack name columns
    rows.forEach((row) => {
      const rowValues = [
        row.rack, row.pack_name, row.start_am, row.stocked_am, row.end_am, row.count_sold_am,
        row.start_pm, row.stocked_pm, row.end_pm, row.count_sold_pm,
        row.purchase_of_the_day, row.sold_pack, row.stocked_carton
      ];
      const newRow = sheet.addRow(rowValues);
  
      const fillColor = getExcelFillColor(row.rack);
  
      // Apply background color to Rack and Pack Name columns
      ['A', 'B'].forEach((col) => {
        const cell = newRow.getCell(col);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fillColor }
        };
      });
    });
  
    // Adjust column widths
    sheet.columns.forEach(column => {
      column.width = 14;
    });
  
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `cigarette_log_${selectedDate}.xlsx`);
  };
  

  return (
    <>{isLoading ? (
      <div className="flex justify-center items-center py-10">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-blue-600">Loading data...</span>
      </div>
    ) : (
    
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold  mb-4 text-gray-800">Cigarette Daily Log</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 px-2 py-1 text-gray-800 rounded shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 transition text-white px-5 py-2 rounded shadow-sm"
        >
          💾 Save
        </button>
        <button
          onClick={exportToExcel}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded shadow-sm"
        >
          📥 Download Excel
        </button>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-[1200px] w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm text-gray-700">
            <tr>
              {[
                'Rack', 'Pack Name', 'Start AM', 'Stocked AM', 'End AM', 'Sold AM',
                'Start PM', 'Stocked PM', 'End PM', 'Sold PM',
                'Purchase', 'Sold Pack', 'Stocked Carton',
              ].map((title) => (
                <th key={title} className="px-4 py-2 border border-gray-200 font-medium">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
               <td className={`border px-3 py-2 text-sm text-gray-800 font-medium ${rackColors[row.rack] || ''}`}>
                  {row.rack}
                </td>
                <td className={`border px-3 py-2 text-sm text-gray-800 font-bold ${rackColors[row.rack] || ''}`}>
                  {row.pack_name}
                </td>
                {Object.entries(row).map(
                  ([key, val]) =>
                    key !== 'rack' &&
                    key !== 'pack_name' && (
                      <td key={key} className="border px-2 py-1 text-gray-800">
                        <input
                          type="number"
                          value={val}
                          onChange={(e) =>
                            handleChange(i, key as keyof CigaretteRow, e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                        />
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>)
  }
  </>);
}


