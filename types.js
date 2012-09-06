

Options = {
  name: String
  votes: Number
}

Vote = {
  username: String
  option: String
  created: Date
}

Issue = {
  first: Option
  second: Option
  votes: [Vote]
  created: Date
}

