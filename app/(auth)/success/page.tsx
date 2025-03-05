"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header"
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {
  const [words, setWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState("");
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [generatedStory, setGeneratedStory] = useState("");
  const [highlightedStory, setHighlightedStory] = useState<string>("");
  
  // This function fetches words from the Supabase database
  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase.from("messages").select("text");
      if (error) {
        console.error("Error fetching words:", error);
      } else {
        setWords(data.map((row) => row.text));
      }
    };
    fetchWords();
  }, []);

   // This function toggles the selection of a word
  const toggleWord = (word: string) => {
    setSelectedWords((prev) => {
      const newSelectedWords = new Set(prev);
      if (newSelectedWords.has(word)) {
        newSelectedWords.delete(word);
      } else {
        newSelectedWords.add(word);
      }
      return newSelectedWords;
    });
  };
  
  // This function adds a new word to the database
  const handleAddWord = async () => {
    if (newWord.trim() === "") return;
    const { error } = await supabase.from("messages").insert([{ text: newWord }]);

    if (error) {
      console.error("Error adding new word:", error);
    } else {
      setWords([...words, newWord]);
      setNewWord("");
    }
  };

  // This function handles word selection and triggers story generation
  const handleGenerateStory = async (words: string[]) => {
    if (selectedWords.size === 0) return alert("Please select at least one word for the story.");

    const response = await fetch("/api/generate-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ words }),
    });

    const data = await response.json();
    if (data?.story) {
      setGeneratedStory(data.story);
      applyHighlighting(data.story);
    } else {
      setGeneratedStory("Failed to generate story.");
    }
  };

  // This function applies highlighting to the generated story
  const applyHighlighting = (story: string) => {
    let highlightedText = story;
  
    Array.from(selectedWords).forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      highlightedText = highlightedText.replace(regex, `<span class="bg-yellow-300 font-bold px-1 rounded">${word}</span>`);
    });
  
    setHighlightedStory(highlightedText);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center p-6 max-w-4xl mx-auto w-full">
        <div className="w-full max-w-2xl mt-16">
          <Input 
            type="text" 
            placeholder="Type a new word..." 
            className="w-full h-12 text-lg px-4 rounded-md"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
          />
        </div>

        <div className="w-full max-w-2xl mt-12">
          <h2 className="text-lg font-semibold mb-4">Vocabulary List:</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant = "secondary" className="bg-purple-500 text-white hover:bg-purple-600" onClick={handleAddWord}>
              + Add
            </Button>
            {words.map((word, index) => (
              <Button key={index} variant="outline" className={`text-lg ${selectedWords.has(word) ? "bg-purple-600 text-white hover:bg-purple-600 hover:text-white" : "hover:bg-purple-600 hover:text-white bg-white text-black"}`}onClick={() => toggleWord(word)}
              >
                {word}
              </Button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-2xl mt-12">
          <Button className="bg-purple-500 text-white hover:bg-purple-600 text-lg" onClick={()=>handleGenerateStory(Array.from(selectedWords))}>
            Generate Story
          </Button>
          <div className="bg-gray-50 rounded-lg p-6">
            {highlightedStory ? (
              <div className="bg-gray-50 rounded-lg p-6 mt-4">
                <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: highlightedStory }} />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 mt-4">
                <p className="text-gray-600">{generatedStory}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}