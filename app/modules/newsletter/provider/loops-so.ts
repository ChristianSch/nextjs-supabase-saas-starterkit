import { LoopsClient } from "loops";

const loops = new LoopsClient(process.env.LOOPS_API_KEY as string);

const loopsNewsletterProvider: NewsletterProvider = {
    async addSubscriber(subscriber: Subscriber): Promise<Error | null> {
        const contact = await loops.createContact(subscriber.email);

        if (contact.success) {
            return null;
        }

        return new Error(contact.message);
    },

    async getSubscriber(email: string): Promise<Subscriber | null> {
        const contact = await loops.findContact({ email: email });

        if (contact.length === 1) {
            return {
                email: contact[0].email,
            };
        } else {
            return null;
        }
    },
};

export default loopsNewsletterProvider;
