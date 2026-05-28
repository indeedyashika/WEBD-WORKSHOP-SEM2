abstract class BankAccount {
    private int accountNumber;
    private String accountHolderName;
    private double balance;

    public BankAccount(int accountNumber, String accountHolderName, double balance) {
        this.accountNumber = accountNumber;
        this.accountHolderName = accountHolderName;
        this.balance = balance;
    }

    public int getAccountNumber() { return accountNumber; }
    public String getAccountHolderName() { return accountHolderName; }
    public double getBalance() { return balance; }

    public void setAccountNumber(int accountNumber) { this.accountNumber = accountNumber; }
    public void setAccountHolderName(String name) { this.accountHolderName = name; }
    public void setBalance(double balance) { this.balance = balance; }

    public void deposit(double amount) {
        balance += amount;
        System.out.println("Amount Deposited: " + amount);
    }

    public abstract double calculateInterest();

    public void displayDetails() {
        System.out.println("Account Number: " + accountNumber);
        System.out.println("Account Holder Name: " + accountHolderName);
        System.out.println("Balance: " + balance);
    }
}

class SavingsAccount extends BankAccount {
    private double interestRate = 0.05;

    public SavingsAccount(int accountNumber, String accountHolderName, double balance) {
        super(accountNumber, accountHolderName, balance);
    }

    @Override
    public double calculateInterest() {
        return getBalance() * interestRate;
    }
}

class CurrentAccount extends BankAccount {
    private double interestRate = 0.02;

    public CurrentAccount(int accountNumber, String accountHolderName, double balance) {
        super(accountNumber, accountHolderName, balance);
    }

    @Override
    public double calculateInterest() {
        return getBalance() * interestRate;
    }
}

public class Exp10 {
    public static void main(String[] args) {
        SavingsAccount sa = new SavingsAccount(101, "Yashika", 10000.0);
        System.out.println("----- Savings Account -----");
        sa.deposit(2000);
        sa.displayDetails();
        System.out.println("Savings Account Interest: " + sa.calculateInterest());

        System.out.println();

        CurrentAccount ca = new CurrentAccount(102, "Sunidhi", 20000.0);
        System.out.println("----- Current Account -----");
        ca.deposit(3000);
        ca.displayDetails();
        System.out.println("Current Account Interest: " + ca.calculateInterest());
    }
}