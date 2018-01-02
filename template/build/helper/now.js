function zerofill (num, width, char /* optional */ ) {
  num = num.toString()
  width = Math.max(width, num.length)
  return ((char || '0').repeat(width) + num).slice(-width)
}

module.exports = function () {
  let time = new Date(),
    yyyy = time.getFullYear(),
    mm = zerofill(time.getMonth() + 1, 2),
    dd = zerofill(time.getDate(), 2),
    hh = zerofill(time.getHours(), 2),
    ii = zerofill(time.getMinutes(), 2),
    ss = zerofill(time.getSeconds(), 2)

  return {
    year: yyyy.toString(),
    month: mm.toString(),
    date: dd.toString(),
    hour: hh.toString(),
    minute: ii.toString(),
    second: ss.toString(),
    text: `${yyyy}-${mm}-${dd} ${hh}:${ii}:${ss}`
  }
}
