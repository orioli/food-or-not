import { Link } from "react-router-dom";

const Acknowledgements = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Acknowledgements
          </h1>
          <p className="text-muted-foreground">
            This project was inspired by the following works
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8 space-y-8">
          <div className="space-y-6">
            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold mb-2">1. Scrandle</h3>
              <p className="text-muted-foreground mb-2">by Bianca Bianra</p>
              <a 
                href="https://scrandle.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                https://scrandle.com/
              </a>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold mb-2">2. The Moral Machine Experiment</h3>
              <p className="text-muted-foreground mb-2">
                Awad, E., Dsouza, S., Kim, R., Schulz, J., Henrich, J., Shariff, A., ... & Rahwan, I. (2018). 
                The moral machine experiment. <em>Nature, 563</em>(7729), 59-64.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-6 py-2">
              <h3 className="text-lg font-semibold mb-2">3. The Brown Book of Design Thinking</h3>
              <p className="text-muted-foreground mb-2">Obesity Workshop</p>
              <a 
                href="https://books.apple.com/gt/book/the-brown-book-of-design-thinking/id983642256" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                https://books.apple.com/gt/book/the-brown-book-of-design-thinking/id983642256
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-primary hover:underline font-semibold"
            >
              ← Back to Sugar Perception Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acknowledgements;
