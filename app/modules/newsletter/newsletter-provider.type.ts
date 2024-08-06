type Subscriber = {
    email: string;
    name?: string;
};

// Usage
// await myNewsletterProvider.addSubscriber({ email: "user@example.com", name: "John Doe" });
// const subscriber = await myNewsletterProvider.getSubscriber("user@example.com");
type NewsletterProvider = {
    addSubscriber: (subscriber: Subscriber) => Promise<Error | null>;
    getSubscriber: (email: string) => Promise<Subscriber | null>;
};
