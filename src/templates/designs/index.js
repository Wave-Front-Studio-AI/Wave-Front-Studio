// All $1 Website templates, keyed by slug. A template that is not designed yet is left out.
import ridgeline from './ridgeline.js'
import harborDental from './harbor-dental.js'
import copperKettle from './copper-kettle.js'
import ironYard from './iron-yard.js'
import lunaSalon from './luna-salon.js'
import bluebird from './bluebird.js'
import oakline from './oakline.js'
import greenleaf from './greenleaf.js'
import brightpath from './brightpath.js'
import summitRealty from './summit-realty.js'
import pawsAndCo from './paws-and-co.js'
import stonework from './stonework.js'
import spark from './spark.js'
import northsideAuto from './northside-auto.js'
import willowStudio from './willow-studio.js'

export const DESIGNS = Object.fromEntries([
  ridgeline,
  harborDental,
  copperKettle,
  ironYard,
  lunaSalon,
  bluebird,
  oakline,
  greenleaf,
  brightpath,
  summitRealty,
  pawsAndCo,
  stonework,
  spark,
  northsideAuto,
  willowStudio
].filter(Boolean).map((design) => [design.slug, design]))
