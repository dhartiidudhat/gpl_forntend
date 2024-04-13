export const backendURL = "http://10.0.3.65:8800";
//Base amount
export const playerBaseAmount = 1000;
//Owner balance
export const ownerTotalBalance = 100000;
//Timer
export const timerSeconds = 90;
//Player won message
export const removeSuccessMessageTime = 10000;//miliSeconds
//Owner increment
export const incrementFromOwner = 1000;

export const commonMessage = "Auction is not started yet...";

export const getUpdatedPlayerDetails = (data) => {
  const result = [];
  data?.forEach((item) => {
    const player = {
      label: item?.playerName,
      id: item?.playerId,
    };
    result.push(player);
  });
  return result;
};


export const fetchUniqueAndHiggestBid = (data) => {
  const uniqueBidAmounts = new Set();

  data?.forEach((item) => {
    uniqueBidAmounts.add({
      ownerName: item?.ownerName,
      bidAmount: item?.bidAmount
    });
  });

  return [...uniqueBidAmounts].sort((a, b) => b?.bidAmount - a?.bidAmount);
};