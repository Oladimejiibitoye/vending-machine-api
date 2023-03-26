

export const getChange = (value: number) => {
  let change: number[] = [];

  let i = 0

  while(value > 0){
    if(value - 100 >= 0){
      change.push(100)
      value -= 100
      i++
    }
    else if(value < 100 && value - 50 >= 0){
      change.push(50)
      value -= 50
      i++
    }
    else if(value < 50 && value - 20 >= 0){
      change.push(20)
      value -= 20
      i++
    }
    else if(value < 20 && value - 10 >= 0){
      change.push(10)
      value -= 10
      i++
    }
    else if(value < 10 && value - 5 >= 0){
      change.push(5)
      value -= 5
      i++
    }
  }

  return change
}