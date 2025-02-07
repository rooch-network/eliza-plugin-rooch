import { describe, it, expect, vi } from 'vitest';
import { IAgentRuntime } from "@elizaos/core";
import { parseKeypair } from '../utils';

describe('parseKeypair', () => {
    it("should parse a valid Rooch secret key correctly", () => {
        // Mock IAgentRuntime, only implementing the getSetting method
        const mockRuntime: Partial<IAgentRuntime> = {
            getSetting: vi.fn((key: string) => {
                if (key === "BITCOIN_PRIVATE_KEY") {
                    return "KzJhi6kxdDjxeUecy16s4nppDUpzLDGdtWqZCyDKezFqJ9YJgphv";
                }
                return null;
            }),
        };

        // Call parseKeypair
        const result = parseKeypair(mockRuntime as IAgentRuntime);

        // Assert the result
        expect(result).toBeDefined();
        // Add more detailed assertions based on the return value of decodeRoochSercetKey
    });

    it("should throw an error if BITCOIN_PRIVATE_KEY is not set", () => {
        // Mock IAgentRuntime, getSetting returns null
        const mockRuntime: Partial<IAgentRuntime> = {
            getSetting: vi.fn((key: string) => null),
        };

        // Assert that an error is thrown
        expect(() => parseKeypair(mockRuntime as IAgentRuntime)).toThrowError(
            "BITCOIN_PRIVATE_KEY is not set"
        );
    });

    it("should throw an error if BITCOIN_PRIVATE_KEY does not start with the correct prefix", () => {
        // Mock IAgentRuntime, getSetting returns an invalid key
        const mockRuntime: Partial<IAgentRuntime> = {
            getSetting: vi.fn((key: string) => {
                if (key === "BITCOIN_PRIVATE_KEY") {
                    return "invalid_prefix_valid_rooch_secret_key";
                }
                return null;
            }),
        };

        // Assert that an error is thrown
        expect(() => parseKeypair(mockRuntime as IAgentRuntime)).toThrowError(
            "Invalid Bitcoin WIF private key"
        );
    });

    it("should throw an error if BITCOIN_PRIVATE_KEY has invalid checksum", () => {
        const invalidChecksumKey = "KzJhi6kxdDjxeUecy16s4nppDUpzLDGdtWqZCyDKezFqJ9YJgphx"; // Invalid checksum
        const mockRuntime: Partial<IAgentRuntime> = {
            getSetting: vi.fn((key: string) => {
                if (key === "BITCOIN_PRIVATE_KEY") {
                    return invalidChecksumKey;
                }
                return null;
            }),
        };

        expect(() => parseKeypair(mockRuntime as IAgentRuntime)).toThrowError(
            "Invalid Bitcoin WIF private key"
        );
    });

    it("should throw an error if BITCOIN_PRIVATE_KEY is too short", () => {
        const shortKey = "KzJhi6kxdDjxeUecy16s4nppDUpzLDGdtWqZCyDKezFqJ9YJgph"; // Too short
        const mockRuntime: Partial<IAgentRuntime> = {
            getSetting: vi.fn((key: string) => {
                if (key === "BITCOIN_PRIVATE_KEY") {
                    return shortKey;
                }
                return null;
            }),
        };

        expect(() => parseKeypair(mockRuntime as IAgentRuntime)).toThrowError(
            "Invalid Bitcoin WIF private key"
        );
    });

    it("should throw an error if BITCOIN_PRIVATE_KEY is too long", () => {
        const longKey = "KzJhi6kxdDjxeUecy16s4nppDUpzLDGdtWqZCyDKezFqJ9YJgphvExtraChars"; // Too long
        const mockRuntime: Partial<IAgentRuntime> = {
            getSetting: vi.fn((key: string) => {
                if (key === "BITCOIN_PRIVATE_KEY") {
                    return longKey;
                }
                return null;
            }),
        };

        expect(() => parseKeypair(mockRuntime as IAgentRuntime)).toThrowError(
            "Invalid Bitcoin WIF private key"
        );
    });
});