export function projectPortfolio(initial, monthly, years, annualRate) {
  const months = years * 12;
  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  const data = [];
  let balance = initial;
  let totalContributions = initial;

  data.push({
    year: 0,
    capital: Math.round(balance),
    apports: Math.round(totalContributions),
    plusValue: 0,
  });

  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + monthlyRate) + monthly;
    totalContributions += monthly;
    if (m % 12 === 0) {
      data.push({
        year: m / 12,
        capital: Math.round(balance),
        apports: Math.round(totalContributions),
        plusValue: Math.round(balance - totalContributions),
      });
    }
  }

  return data;
}
